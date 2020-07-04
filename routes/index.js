const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Elemental Calculator - Home' });
});

/* GET register page. */
router.get('/register', (req, res, next) => {
  res.send('GET /register')
});

/* POST register user */
router.post('/register', (req, res, next) => {
  res.send('POST /register')
});

/* GET login page */
router.get('/login', (req, res, next) => {
  res.send('GET /login')
});

/* POST login  */
router.post('/login', (req, res, next) => {
  res.send('POST /login')
});

/* GET profile page */
//EDIT FORM IS GOING TO GO IN HERE TOO
router.get('/profile', (req, res, next) => {
  res.send('GET /profile')
});

/* PUT profile page */
router.put('/profile/:user_id', (req, res, next) => {
  res.send('PUT /profile/:user_id')
});

/* POST logout  */
router.post('/logout', (req, res, next) => {
  res.send('POST /logout')
});



module.exports = router;
