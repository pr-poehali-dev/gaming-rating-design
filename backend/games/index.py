"""
Игры и оценки GameRate.
action=list — получить все игры с рейтингами
action=rate — поставить/обновить оценку (требует токен)
"""
import json
import os
import hashlib

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

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "list")
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")

    conn = get_conn()
    cur = conn.cursor()

    # GET list — список всех игр с агрегированным рейтингом
    if action == "list":
        cur.execute(
            f"""SELECT g.id, g.title, g.genre, g.year, g.publisher, g.cover_url, g.description,
                       COALESCE(AVG(r.rating)::numeric(3,1), 0) AS avg_rating,
                       COUNT(r.id) AS ratings_count
                FROM {schema}.games g
                LEFT JOIN {schema}.ratings r ON r.game_id = g.id
                GROUP BY g.id
                ORDER BY g.id"""
        )
        rows = cur.fetchall()
        games = [{
            "id": r[0], "title": r[1], "genre": r[2], "year": r[3],
            "publisher": r[4], "cover": r[5], "description": r[6],
            "rating": float(r[7]) if r[7] else 0,
            "ratingsCount": int(r[8]),
        } for r in rows]
        return ok({"games": games})

    # GET userRatings — мои оценки
    if action == "userRatings":
        auth_header = (event.get("headers") or {}).get("X-Authorization", "")
        token = auth_header.replace("Bearer ", "").strip()
        if not token:
            return ok({"ratings": []})
        user_id = get_user_id(conn, token, schema)
        if not user_id:
            return ok({"ratings": []})
        cur.execute(
            f"SELECT game_id, rating, comment FROM {schema}.ratings WHERE user_id = %s",
            (user_id,),
        )
        rows = cur.fetchall()
        return ok({"ratings": [{"gameId": r[0], "rating": r[1], "comment": r[2]} for r in rows]})

    # POST rate — поставить оценку
    if action == "rate":
        auth_header = (event.get("headers") or {}).get("X-Authorization", "")
        token = auth_header.replace("Bearer ", "").strip()
        if not token:
            return err("Войдите, чтобы оценивать", 401)
        user_id = get_user_id(conn, token, schema)
        if not user_id:
            return err("Сессия истекла", 401)

        body = json.loads(event.get("body") or "{}")
        game_id = body.get("gameId")
        rating = body.get("rating")
        comment = body.get("comment", "")
        criteria = body.get("criteria", {})

        if not game_id or not rating or rating < 1 or rating > 5:
            return err("Некорректные данные")

        # Проверим что игра существует
        cur.execute(f"SELECT id FROM {schema}.games WHERE id = %s", (game_id,))
        if not cur.fetchone():
            return err("Игра не найдена", 404)

        # Проверим, ставил ли пользователь оценку раньше
        cur.execute(
            f"SELECT id FROM {schema}.ratings WHERE user_id = %s AND game_id = %s",
            (user_id, game_id),
        )
        existing = cur.fetchone()

        is_new = existing is None

        if existing:
            cur.execute(
                f"""UPDATE {schema}.ratings
                    SET rating = %s, graphics = %s, gameplay = %s, story = %s, sound = %s, comment = %s, created_at = NOW()
                    WHERE id = %s""",
                (rating, criteria.get("graphics"), criteria.get("gameplay"),
                 criteria.get("story"), criteria.get("sound"), comment, existing[0]),
            )
        else:
            cur.execute(
                f"""INSERT INTO {schema}.ratings (user_id, game_id, rating, graphics, gameplay, story, sound, comment)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                (user_id, game_id, rating,
                 criteria.get("graphics"), criteria.get("gameplay"),
                 criteria.get("story"), criteria.get("sound"), comment),
            )

        # Начисляем XP за новую оценку: 10 XP за просто оценку, +15 если есть комментарий
        xp_gained = 0
        if is_new:
            xp_gained = 10
            if comment.strip():
                xp_gained += 15
            cur.execute(
                f"UPDATE {schema}.users SET xp = xp + %s, ratings_count = ratings_count + 1, reviews_count = reviews_count + %s WHERE id = %s RETURNING xp",
                (xp_gained, 1 if comment.strip() else 0, user_id),
            )
            new_xp = cur.fetchone()[0]
            new_level = compute_xp_level(new_xp)
            cur.execute(
                f"UPDATE {schema}.users SET level = %s WHERE id = %s",
                (new_level, user_id),
            )

        # Получаем новый средний рейтинг
        cur.execute(
            f"""SELECT AVG(rating)::numeric(3,1), COUNT(*) FROM {schema}.ratings WHERE game_id = %s""",
            (game_id,),
        )
        avg, count = cur.fetchone()

        conn.commit()

        return ok({
            "ok": True,
            "xpGained": xp_gained,
            "gameRating": float(avg) if avg else 0,
            "ratingsCount": int(count),
            "isNew": is_new,
        })

    return err("Неизвестное действие", 404)
