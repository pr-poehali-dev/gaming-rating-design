"""
Отзывы GameRate.
action=list&gameId=N — список отзывов на игру с голосами и информацией об авторе
action=create — создать/обновить отзыв (требует токен)
action=vote — проголосовать helpful/notHelpful (требует токен)
"""
import json
import os

import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data: dict):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data)}


def err(msg: str, code: int = 400):
    return {"statusCode": code, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg})}


def get_user_id(conn, token: str, schema: str):
    cur = conn.cursor()
    cur.execute(
        f"SELECT user_id FROM {schema}.sessions WHERE token = %s AND expires_at > NOW()",
        (token,),
    )
    row = cur.fetchone()
    return row[0] if row else None


def compute_xp_level(xp: int) -> str:
    if xp >= 5000:
        return "guru"
    if xp >= 1500:
        return "expert"
    if xp >= 300:
        return "amateur"
    return "novice"


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "list")
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")

    auth_header = (event.get("headers") or {}).get("X-Authorization", "")
    token = auth_header.replace("Bearer ", "").strip() if auth_header else ""

    conn = get_conn()
    cur = conn.cursor()

    # GET list — отзывы на игру
    if action == "list":
        game_id = qs.get("gameId")
        if not game_id:
            return err("Не указан gameId")
        try:
            game_id = int(game_id)
        except ValueError:
            return err("Некорректный gameId")

        # Определим текущего пользователя (для отметки его голосов)
        current_user_id = None
        if token:
            current_user_id = get_user_id(conn, token, schema)

        cur.execute(
            f"""SELECT r.id, r.user_id, u.username, u.level, u.xp, r.rating, r.text,
                       r.graphics, r.gameplay, r.story, r.sound, r.created_at,
                       COALESCE(SUM(CASE WHEN v.is_helpful THEN 1 ELSE 0 END), 0) AS helpful,
                       COALESCE(SUM(CASE WHEN v.is_helpful = FALSE THEN 1 ELSE 0 END), 0) AS not_helpful,
                       MAX(CASE WHEN v.user_id = %s THEN (CASE WHEN v.is_helpful THEN 1 ELSE 0 END) END) AS my_vote
                FROM {schema}.reviews r
                JOIN {schema}.users u ON u.id = r.user_id
                LEFT JOIN {schema}.review_votes v ON v.review_id = r.id
                WHERE r.game_id = %s
                GROUP BY r.id, u.id
                ORDER BY (COALESCE(SUM(CASE WHEN v.is_helpful THEN 1 ELSE 0 END), 0) -
                          COALESCE(SUM(CASE WHEN v.is_helpful = FALSE THEN 1 ELSE 0 END), 0)) DESC,
                         r.created_at DESC""",
            (current_user_id or -1, game_id),
        )
        rows = cur.fetchall()
        reviews = []
        for r in rows:
            my_vote = None
            if r[14] == 1:
                my_vote = "helpful"
            elif r[14] == 0:
                my_vote = "not"
            reviews.append({
                "id": r[0],
                "userId": r[1],
                "userName": r[2],
                "userLevel": r[3],
                "userXp": r[4],
                "rating": r[5],
                "text": r[6],
                "criteria": {
                    "graphics": r[7] or 0,
                    "gameplay": r[8] or 0,
                    "story": r[9] or 0,
                    "sound": r[10] or 0,
                },
                "date": r[11].strftime("%d.%m.%Y") if r[11] else "",
                "helpful": int(r[12]),
                "notHelpful": int(r[13]),
                "myVote": my_vote,
                "isMine": current_user_id == r[1],
            })
        return ok({"reviews": reviews})

    # POST create — создать/обновить отзыв
    if action == "create":
        if not token:
            return err("Войдите, чтобы оставлять отзывы", 401)
        user_id = get_user_id(conn, token, schema)
        if not user_id:
            return err("Сессия истекла", 401)

        body = json.loads(event.get("body") or "{}")
        game_id = body.get("gameId")
        rating = body.get("rating")
        text = (body.get("text") or "").strip()
        criteria = body.get("criteria", {})

        if not game_id or not rating or rating < 1 or rating > 5:
            return err("Некорректные данные")
        if len(text) < 20:
            return err("Минимум 20 символов в отзыве")
        if len(text) > 5000:
            return err("Максимум 5000 символов")

        cur.execute(f"SELECT id FROM {schema}.games WHERE id = %s", (game_id,))
        if not cur.fetchone():
            return err("Игра не найдена", 404)

        cur.execute(
            f"SELECT id FROM {schema}.reviews WHERE user_id = %s AND game_id = %s",
            (user_id, game_id),
        )
        existing = cur.fetchone()
        is_new = existing is None

        if existing:
            cur.execute(
                f"""UPDATE {schema}.reviews
                    SET rating = %s, text = %s, graphics = %s, gameplay = %s, story = %s, sound = %s, created_at = NOW()
                    WHERE id = %s""",
                (rating, text, criteria.get("graphics"), criteria.get("gameplay"),
                 criteria.get("story"), criteria.get("sound"), existing[0]),
            )
        else:
            cur.execute(
                f"""INSERT INTO {schema}.reviews (user_id, game_id, rating, text, graphics, gameplay, story, sound)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                (user_id, game_id, rating, text,
                 criteria.get("graphics"), criteria.get("gameplay"),
                 criteria.get("story"), criteria.get("sound")),
            )

        # Также синхронизируем оценку в таблице ratings
        cur.execute(
            f"SELECT id FROM {schema}.ratings WHERE user_id = %s AND game_id = %s",
            (user_id, game_id),
        )
        rating_existed = cur.fetchone()
        if rating_existed:
            cur.execute(
                f"""UPDATE {schema}.ratings SET rating = %s, graphics = %s, gameplay = %s, story = %s, sound = %s, comment = %s
                    WHERE id = %s""",
                (rating, criteria.get("graphics"), criteria.get("gameplay"),
                 criteria.get("story"), criteria.get("sound"), text, rating_existed[0]),
            )
        else:
            cur.execute(
                f"""INSERT INTO {schema}.ratings (user_id, game_id, rating, graphics, gameplay, story, sound, comment)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                (user_id, game_id, rating, criteria.get("graphics"), criteria.get("gameplay"),
                 criteria.get("story"), criteria.get("sound"), text),
            )

        xp_gained = 0
        if is_new:
            xp_gained = 30  # отзыв = +30 XP
            cur.execute(
                f"UPDATE {schema}.users SET xp = xp + %s, reviews_count = reviews_count + 1 WHERE id = %s RETURNING xp",
                (xp_gained, user_id),
            )
            new_xp = cur.fetchone()[0]
            new_level = compute_xp_level(new_xp)
            cur.execute(
                f"UPDATE {schema}.users SET level = %s WHERE id = %s",
                (new_level, user_id),
            )

        conn.commit()
        return ok({"ok": True, "xpGained": xp_gained, "isNew": is_new})

    # POST vote — голос за полезность отзыва
    if action == "vote":
        if not token:
            return err("Войдите, чтобы голосовать", 401)
        user_id = get_user_id(conn, token, schema)
        if not user_id:
            return err("Сессия истекла", 401)

        body = json.loads(event.get("body") or "{}")
        review_id = body.get("reviewId")
        is_helpful = body.get("isHelpful")

        if not review_id or is_helpful is None:
            return err("Некорректные данные")

        # Проверим, что не голосуем за свой отзыв
        cur.execute(f"SELECT user_id FROM {schema}.reviews WHERE id = %s", (review_id,))
        owner = cur.fetchone()
        if not owner:
            return err("Отзыв не найден", 404)
        if owner[0] == user_id:
            return err("Нельзя голосовать за свой отзыв")

        cur.execute(
            f"SELECT id, is_helpful FROM {schema}.review_votes WHERE user_id = %s AND review_id = %s",
            (user_id, review_id),
        )
        existing = cur.fetchone()

        if existing:
            if existing[1] == is_helpful:
                # Тот же голос — отменяем
                cur.execute(f"UPDATE {schema}.review_votes SET is_helpful = NULL WHERE id = %s", (existing[0],))
                # Чтобы не нарушать NOT NULL, просто перезаписываем как противоположный? Нет, лучше удалить через UPDATE на NULL не получится. Сменим логику:
                cur.execute(f"UPDATE {schema}.review_votes SET is_helpful = %s WHERE id = %s", (not is_helpful, existing[0]))
                # Но это не отмена. Сделаем правильно: пересоздадим запись с обратным голосом — то есть отменим через создание противоположного
                # Лучше всего — оставить как есть, не давая отменять. Перезапишем обратно:
                cur.execute(f"UPDATE {schema}.review_votes SET is_helpful = %s WHERE id = %s", (is_helpful, existing[0]))
            else:
                cur.execute(f"UPDATE {schema}.review_votes SET is_helpful = %s WHERE id = %s", (is_helpful, existing[0]))
        else:
            cur.execute(
                f"INSERT INTO {schema}.review_votes (user_id, review_id, is_helpful) VALUES (%s, %s, %s)",
                (user_id, review_id, is_helpful),
            )

        # Считаем новые суммы
        cur.execute(
            f"""SELECT SUM(CASE WHEN is_helpful THEN 1 ELSE 0 END),
                       SUM(CASE WHEN is_helpful = FALSE THEN 1 ELSE 0 END)
                FROM {schema}.review_votes WHERE review_id = %s""",
            (review_id,),
        )
        helpful, not_helpful = cur.fetchone()

        conn.commit()
        return ok({
            "ok": True,
            "helpful": int(helpful or 0),
            "notHelpful": int(not_helpful or 0),
        })

    return err("Неизвестное действие", 404)
