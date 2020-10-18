const Card = require('../models/card.js');

const getCards = (req, res) => Card.find({})
  .then((cards) => {
    if (cards) {
      res.status(200).send(cards);
    } else {
      res.status(404).send({ message: 'No cards found' });
    }
  })
  .catch(() => res.status(500).send({ message: 'Internal error' }));

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((result) => {
      if (result) {
        res.status(200).send({ data: result });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'User validation failed' });
      } else {
        res.status(500).send({ message: 'Internal error' });
      }
    });
}

function deleteCard(req, res) {
  const id = req.params.cardId;
  Card.findByIdAndRemove(id)
    .then(() => res.status(200).send({ message: 'Card deleted' }))
    .catch((err) => {
      if (req.params.id === undefined) {
        res.status(404).send({ message: 'Could not find a card with that id' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Improper data format' });
      } else {
        res.status(500).send({ message: 'Internal error' });
      }
    });
}

function addCardLike(req, res) {
  const id = req.params.cardId;
  const user = req.user._id;
  Card.findByIdAndUpdate(id, { $addToSet: { likes: user } })
    .then(() => {
      res.status(200).send({ message: 'Like added' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Improper data format' });
      } else {
        res.status(500).send({ message: 'Internal error' });
      }
    });
}

function removeCardLike(req, res) {
  const id = req.params.cardId;
  const user = req.user._id;
  Card.findByIdAndUpdate(id, { $pull: { likes: user } })
    .then(() => {
      res.status(200).send({ message: 'Like removed' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Improper data format' });
      } else {
        res.status(500).send({ message: 'Internal error' });
      }
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  removeCardLike,
};
