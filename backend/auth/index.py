"""
Авторизация пользователей GameRate: регистрация, вход, проверка сессии, выход.
action передаётся через query-параметр ?action=register|login|me|logout
"""
import json
import os
import hashlib
import secrets
import re
from datetime import datetime, timedelta

import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data: dict, cookie: str = None):
    headers = {**CORS, "Content-Type": "application/json"}
    if cookie:
        headers["X-Set-Cookie"] = cookie
    return {"statusCode": 200, "headers": headers, "body": json.dumps(data)}


def err(msg: str, code: int = 400):
    return {
        "statusCode": code,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps({"error": msg}),
    }


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_user_from_token(conn, token: str, schema: str):
    cur = conn.cursor()
    cur.execute(
        f"SELECT u.id, u.username, u.email, u.level, u.xp, u.coins, u.ratings_count, u.reviews_count "
        f"FROM {schema}.sessions s "
        f"JOIN {schema}.users u ON u.id = s.user_id "
        f"WHERE s.token = %s AND s.expires_at > NOW()",
        (token,),
    )
    row = cur.fetchone()
    if not row:
        return None
    return {
        "id": row[0], "username": row[1], "email": row[2],
        "level": row[3], "xp": row[4], "coins": row[5],
        "ratingsCount": row[6], "reviewsCount": row[7],
    }


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")

    # action из query ?action=register|login|me|logout
    action = qs.get("action", "")

    # Токен из заголовка X-Authorization: Bearer <token> или X-Cookie
    auth_header = (event.get("headers") or {}).get("X-Authorization", "")
    token = auth_header.replace("Bearer ", "").strip() if auth_header else ""
    if not token:
        cookie_header = (event.get("headers") or {}).get("X-Cookie", "")
        for part in cookie_header.split(";"):
            part = part.strip()
            if part.startswith("gr_token="):
                token = part[len("gr_token="):]

    conn = get_conn()

    # GET ?action=me
    if action == "me":
        if not token:
            return err("Не авторизован", 401)
        user = get_user_from_token(conn, token, schema)
        if not user:
            return err("Сессия истекла", 401)
        return ok({"user": user})

    # POST ?action=logout
    if action == "logout":
        if token:
            cur = conn.cursor()
            cur.execute(f"UPDATE {schema}.sessions SET expires_at = NOW() WHERE token = %s", (token,))
            conn.commit()
        return ok({"ok": True}, cookie="gr_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax")

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    # POST ?action=register
    if action == "register":
        username = (body.get("username") or "").strip()
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not username or len(username) < 3:
            return err("Имя пользователя минимум 3 символа")
        if not re.match(r"^[a-zA-Z0-9_]+$", username):
            return err("Только латинские буквы, цифры и _")
        if not email or "@" not in email:
            return err("Некорректный email")
        if len(password) < 6:
            return err("Пароль минимум 6 символов")

        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {schema}.users WHERE email = %s OR username = %s", (email, username))
        if cur.fetchone():
            return err("Email или имя пользователя уже заняты")

        pwd_hash = hash_password(password)
        cur.execute(
            f"INSERT INTO {schema}.users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
            (username, email, pwd_hash),
        )
        user_id = cur.fetchone()[0]

        tok = secrets.token_hex(32)
        expires = datetime.utcnow() + timedelta(days=30)
        cur.execute(
            f"INSERT INTO {schema}.sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
            (user_id, tok, expires),
        )
        conn.commit()

        cookie = f"gr_token={tok}; Max-Age=2592000; Path=/; HttpOnly; SameSite=Lax"
        return ok({
            "token": tok,
            "user": {
                "id": user_id, "username": username, "email": email,
                "level": "novice", "xp": 0, "coins": 0,
                "ratingsCount": 0, "reviewsCount": 0,
            }
        }, cookie=cookie)

    # POST ?action=login
    if action == "login":
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not email or not password:
            return err("Укажите email и пароль")

        cur = conn.cursor()
        cur.execute(
            f"SELECT id, username, email, level, xp, coins, ratings_count, reviews_count "
            f"FROM {schema}.users WHERE email = %s AND password_hash = %s",
            (email, hash_password(password)),
        )
        row = cur.fetchone()
        if not row:
            return err("Неверный email или пароль")

        tok = secrets.token_hex(32)
        expires = datetime.utcnow() + timedelta(days=30)
        cur.execute(
            f"INSERT INTO {schema}.sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
            (row[0], tok, expires),
        )
        conn.commit()

        cookie = f"gr_token={tok}; Max-Age=2592000; Path=/; HttpOnly; SameSite=Lax"
        return ok({
            "token": tok,
            "user": {
                "id": row[0], "username": row[1], "email": row[2],
                "level": row[3], "xp": row[4], "coins": row[5],
                "ratingsCount": row[6], "reviewsCount": row[7],
            }
        }, cookie=cookie)

    return err("Неизвестное действие", 404)
