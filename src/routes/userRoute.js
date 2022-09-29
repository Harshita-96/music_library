const User = require("../controllers/userController");

var router = require("express").Router();

// Create a new Tutorial
router.post("/signUp", User.create);

// Retrieve all Tutorials
router.get("/", User.findAll);
router.post("/token", User.checkToken);
router.get("/getSongs", User.getUserSongs);

router.post("/login", User.findOne);
router.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

// // Retrieve all published Tutorials
// router.get("/published", tutorials.findAllPublished);

// // Retrieve a single Tutorial with id
// router.get("/:id", tutorials.findOne);

// // Update a Tutorial with id
// router.put("/:id", tutorials.update);

// // Delete a Tutorial with id
// router.delete("/:id", tutorials.delete);

// // Delete all Tutorials
// router.delete("/", tutorials.deleteAll);

module.exports = router;
