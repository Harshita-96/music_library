const db = require("../models");
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const User = db.User;
const song = db.Song;
const jwt = require("jsonwebtoken");
const { Song } = require("../models");

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.username) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  let password = bcrypt.hashSync(req.body.password, 8);
  // Create a Tutorial
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: password,
  };

  // Save Tutorial in the database
  User.create(user)
    .then((data) => {
      const accessToken = jwt.sign(data.username, "user", { expiresIn: "50s" });
      res.send(
        `User ${data.username} registered successfully with key ${accessToken}`
      );
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  User.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

exports.findOne = (req, res) => {
  const username = req.body.username;
  var password = req.body.password;
  var condition = { username: { [Op.iLike]: `${username}` } };

  User.findOne({ where: condition })
    .then((data) => {
      if (bcrypt.compareSync(password, data.password)) res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};
exports.getUserSongs = (req, res) => {
  User.findAll({
    include: [
      {
        model: Song,
        as: "song",
      },
    ],
    where: { username: req.body.username },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => res.send(err));
};
