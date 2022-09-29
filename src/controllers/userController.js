const db = require("../models");
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const User = db.User;
const song = db.Song;
const jwt = require("jsonwebtoken");
const { Song } = require("../models");

let refreshTokens = [];

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
      const accessToken = jwt.sign({ username: data.username }, "user", {
        expiresIn: "5m",
      });
      const refreshToken = jwt.sign({ username: data.username }, "refresh");
      refreshTokens.push(refreshToken);
      const user = {
        user: data.username,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      res.send(JSON.stringify(user));
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
      if (bcrypt.compareSync(password, data.password)) {
        let token = req.body.token;
        let decodedToken = jwt.verify(token, "user");
        if (decodedToken) res.send(data);
      } else {
        res.send("Token sent is incorrect");
      }
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
    where: { id: parseInt(req.body.username) },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => res.send(err));
};

//Delete user
exports.destroy = (req, res) => {
  const username = req.body.username;
  var condition = { username: { [Op.iLike]: `${username}` } };

  User.destroy({ where: condition })
    .then((data) => {
      res.send("User successfully deleted");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while deleting user.",
      });
    });
};

//Update user
exports.update = (req, res) => {
  const username = req.body.username;
  var condition = { username: { [Op.iLike]: `${username}` } };

  User.update({ email: req.body.email }, { where: condition })
    .then((data) => {
      res.send("User updated successfully deleted");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while updating user.",
      });
    });
};

//Check refresh token
exports.checkToken = (req, res) => {
  const token = req.body.refreshToken;
  if (token == null) res.sendStatus(500);
  if (!refreshTokens.includes(token)) {
    res.send(403);
  } else {
    jwt.verify(token, "refresh", (err, data) => {
      if (err) res.sendStatus(503);
      else {
        const accessToken = jwt.sign({ username: data.username }, "user", {
          expiresIn: "5m",
        });
        res.json(accessToken);
      }
    });
  }
};
