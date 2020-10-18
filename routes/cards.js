const router = require('express').Router();
const bodyParser = require('body-parser');
const {
  getCards, createCard, deleteCard, addCardLike, removeCardLike,
} = require('../controllers/cards');

const jsonParser = bodyParser.json();

router.get('/cards', getCards);

router.post('/cards', jsonParser, createCard);

router.delete('/cards/:cardId', jsonParser, deleteCard);

router.put('/cards/:cardId/likes', jsonParser, addCardLike);

router.delete('/cards/:cardId/likes', jsonParser, removeCardLike);

module.exports = router;
