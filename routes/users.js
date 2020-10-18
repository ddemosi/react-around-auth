const router = require('express').Router();
const bodyParser = require('body-parser');
const {
  getUsers, createUser, getUserById, updateUserAvatar, updateUserInfo,
} = require('../controllers/users');

const jsonParser = bodyParser.json();

router.get('/users', getUsers);

router.get('/users/:id', getUserById);

router.post('/users', jsonParser, createUser);

router.patch('/users/me', jsonParser, updateUserInfo);

router.patch('/users/me/avatar', jsonParser, updateUserAvatar);

router.use((err, req, res, next) => {
  if (err.status === 404) {
    return res.status(400).render('404');
  }

  if (err.status === 500) {
    return res.status(500).render('500');
  }

  return next();
});

module.exports = router;
