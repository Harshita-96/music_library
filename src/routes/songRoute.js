const Song = require("../controllers/songController");
var router = require("express").Router();

//Find all songs
router.post("/", Song.create);

module.exports = router;
