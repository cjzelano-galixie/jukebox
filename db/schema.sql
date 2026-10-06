DROP TABLE IF EXISTS playlists_tracks;
DROP TABLE IF EXISTS tracks CASCADE;
DROP TABLE IF EXISTS playlists CASCADE;

CREATE TABLE playlists(
    id serial PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL
);

CREATE TABLE tracks(
    id serial PRIMARY KEY,
    name text NOT NULL,
    duration_ms integer NOT NULL
);

CREATE TABLE playlists_tracks(
    id serial PRIMARY KEY,
    playlist_id INT NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    track_id INT NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    UNIQUE(playlist_id, track_id)
);