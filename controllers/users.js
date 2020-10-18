const User = require('../models/user.js');

function getUsers(req, res) {
  User.find({})
    .then((users) => {
      if (users === undefined) {
        res.status(404).send({ message: 'No users found' });
      }
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(500).send({ message: 'Internal error' });
    });
}

function getUserById(req, res) {
  const id = req.params.id;
  User.findById(id)
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send({ message: 'Could not find user with that id' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Improper data format' });
      } else {
        res.status(500).send({ message: 'Internal Error' });
      }
    });
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((result) => {
      if (result) {
        res.status(200).send({ data: result });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'User validation failed' });
      } else {
        res.status(500).send({ message: 'Internal server error' });
      }
    });
}

function updateUserInfo(req, res) {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { name, about })
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      }
    })
    .catch(() => {
      res.status(500).send({ message: 'Internal Error' });
    });
}

function updateUserAvatar(req, res) {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { avatar })
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      }
    })
    .catch(() => {
      res.status(500).send({ message: 'Internal Error' });
    });
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
