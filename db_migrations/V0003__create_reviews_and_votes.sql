CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    game_id INTEGER NOT NULL REFERENCES games(id),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    text TEXT NOT NULL,
    graphics SMALLINT,
    gameplay SMALLINT,
    story SMALLINT,
    sound SMALLINT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, game_id)
);

CREATE TABLE IF NOT EXISTS review_votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    review_id INTEGER NOT NULL REFERENCES reviews(id),
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, review_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_game ON reviews(game_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_review_votes_review ON review_votes(review_id);
