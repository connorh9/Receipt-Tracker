PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT,
    password_hash TEXT
);

CREATE TABLE IF NOT EXISTS receipts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total REAL NOT NULL,
    business TEXT DEFAULT 'UNKNOWN',
    items TEXT,
    timestamp TEXT NOT NULL,
    expense_type TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS items (
    item TEXT NOT NULL,
    price REAL NOT NULL,
    receipt_id INTEGER NOT NULL,
    FOREIGN KEY (receipt_id) REFERENCES receipt(id) ON DELETE CASCADE
);