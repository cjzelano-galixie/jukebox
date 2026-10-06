import db from "#db/client";
import { createPlaylist, createPlaylistTrack } from "#db/queries/playlists";
import { createTrack } from "#db/queries/tracks";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const tracks = [];
  for (let i = 1; i <= 20; i++) {
    const duration = Math.floor(Math.random() * 180000) + 120000;
    const track = await createTrack(`Song Title ${i}`, duration);
    tracks.push(track);
  }

  const playlists = [];
  for (let i = 1; i <= 10; i++) {
    const playlist = await createPlaylist(
      `Playlist ${i}`,
      `For when you're vibing to ${i}`,
    );
    playlists.push(playlist);
  }

  for (let i = 0; i < playlists.length; i++) {
    const track1 = tracks[i * 2];
    const track2 = tracks[i * 2 + 1];

    await createPlaylistTrack(playlists[i].id, track1.id);
    await createPlaylistTrack(playlists[i].id, track2.id);
  }
}
