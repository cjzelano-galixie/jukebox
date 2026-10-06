import express from "express";
const router = express.Router();
import {
  getPlaylists,
  createPlaylist,
  getPlaylistById,
  getTracksFromPlaylist,
  createPlaylistTrack,
} from "#db/queries/playlists";
import requireBody from "#middleware/requireBody";

router.get("/", async (req, res) => {
  const playlists = await getPlaylists();
  res.send(playlists);
});

router.post("/", requireBody(["name", "description"]), async (req, res) => {
  const { name, description } = req.body;
  const newPlaylist = await createPlaylist(name, description);
  res.status(201).json(newPlaylist);
});

router.param("id", async (req, res, next, id) => {
  const playlistId = Number(id);
  if (Number.isNaN(playlistId))
    return res.status(400).send("Invalid playlist id");

  const playlist = await getPlaylistById(playlistId);
  if (!playlist) return res.status(404).send("Playlist not found.");

  req.playlist = playlist;
  next();
});

router.get("/:id", (req, res) => {
  res.send(req.playlist);
});

//GET
//sends all tracks in playlist
//400 if id NaN
router.get("/:id/tracks", async (req, res) => {
  const tracks = await getTracksFromPlaylist(req.playlist.id);
  res.send(tracks);
});

//POST
//400 if missing body - use requireBody
//400 if missing req fields - use requireBody
//400 if track does not exist
//400 if trackId is NaN
//404 if playlist does not exist
//400 is playlistId is NaN
//creates a new playlist_track
//400 if track is already in playlist
router.post("/:id/tracks", requireBody(["trackId"]), async (req, res) => {
  const trackId = Number(req.body.trackId);

  if (Number.isNaN(trackId)) {
    return res.status(400).send("trackId must be a valid number");
  }

  const playlistId = req.playlist ? req.playlist.id : Number(req.params.id);

  try {
    const newPlaylistTrack = await createPlaylistTrack(playlistId, trackId);
    return res.status(201).json(newPlaylistTrack);
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).send("Track does not exist.");
    }

    if (error.code === "23505") {
      return res.status(400).send("Track is already in playlist.");
    }
  }
});

export default router;
