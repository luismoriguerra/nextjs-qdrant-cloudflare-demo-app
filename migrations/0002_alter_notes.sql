-- Migration number: 0002 	 2025-02-10T05:08:54.070Z

CREATE TABLE notes_new (
    id TEXT PRIMARY KEY,
    notebook_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO notes_new SELECT * FROM notes;
DROP TABLE notes;
ALTER TABLE notes_new RENAME TO notes;
