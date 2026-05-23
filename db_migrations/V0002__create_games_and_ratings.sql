CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    publisher VARCHAR(200),
    cover_url TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    game_id INTEGER NOT NULL REFERENCES games(id),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    graphics SMALLINT,
    gameplay SMALLINT,
    story SMALLINT,
    sound SMALLINT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, game_id)
);

CREATE INDEX IF NOT EXISTS idx_ratings_game ON ratings(game_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id);

INSERT INTO games (id, title, genre, year, publisher, cover_url, description) VALUES
(1, 'Хроники Пустоты', 'RPG', 2024, 'Dark Nexus Studios', 'https://cdn.poehali.dev/projects/22300a62-6b08-4ac2-a525-b8bb5fc1cfac/files/3ceba7a9-0802-4e2c-b3ab-681805d2463b.jpg', 'Эпическая RPG в тёмном фэнтезийном мире.'),
(2, 'Нова-7', 'Шутер', 2024, 'Stellar Works', 'https://cdn.poehali.dev/projects/22300a62-6b08-4ac2-a525-b8bb5fc1cfac/files/3a9f6906-a0cf-4f2f-9475-09970930431f.jpg', 'Космический шутер нового поколения.'),
(3, 'Дикие Земли', 'Приключения', 2023, 'Nomad Game Co.', 'https://cdn.poehali.dev/projects/22300a62-6b08-4ac2-a525-b8bb5fc1cfac/files/b34cffe6-443a-4f34-80d4-bb4f78dd84ec.jpg', 'Открытый мир с живой экосистемой.'),
(4, 'Последний Рассвет', 'Хоррор', 2024, 'Nightmare Inc.', 'https://cdn.poehali.dev/projects/22300a62-6b08-4ac2-a525-b8bb5fc1cfac/files/568bc1f6-0dd3-48c4-9408-22539e75f482.jpg', 'Психологический хоррор в заброшенном городе.'),
(5, 'Кибер-Токио', 'Экшен', 2023, 'Neon Pulse', 'https://cdn.poehali.dev/projects/22300a62-6b08-4ac2-a525-b8bb5fc1cfac/files/1c2f1b07-1636-4ffe-b1ab-ff3fee58361b.jpg', 'Киберпанк-экшен в мегаполисе будущего.'),
(6, 'Империи и Драконы', 'Стратегия', 2023, 'Crown Games', 'https://cdn.poehali.dev/projects/22300a62-6b08-4ac2-a525-b8bb5fc1cfac/files/2ebdafb7-b4ba-4710-822a-e6f2b53f7ea3.jpg', 'Глобальная стратегия в мире высокого фэнтези.')
ON CONFLICT (id) DO NOTHING;

SELECT setval('games_id_seq', (SELECT MAX(id) FROM games));
