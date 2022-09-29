const db = require("../models");
const Song = db.Song;
exports.create = (req, res) => {
  // Create a Song
  const song = {
    username: req.body.songname,
    artist: req.body.artist,
    username: req.body.username,
  };

  // Save Tutorial in the database
  Song.create(song)
    .then((data) => {
      res.send(`Song ${data.songname} saved successfully`);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Song.",
      });
    });
};
