import express from "express";
const router = express.Router();
import { getTracks, getTrackById } from "#db/queries/tracks";

router.get("/", async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.param("id", async (req, res, next, id) => {
  const trackId = Number(id);
  if (Number.isNaN(trackId)) return res.status(400).send("Invalid track id");

  const track = await getTrackById(id);
  if (!track) return res.status(404).send("Track not found.");

  req.track = track;
  next();
});

router.get("/:id", (req, res) => {
  res.send(req.track);
});

export default router;
