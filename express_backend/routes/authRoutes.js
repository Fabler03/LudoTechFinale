const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authControllers.js');
const { registerValidator, loginValidator, updateValidator, validate } = require('../validators/authValidators.js');

// Registrazione
router.post('/register', registerValidator, validate, AuthController.register);

// Login
router.post('/login', loginValidator, validate, AuthController.login);

// modifica dati utente
router.put('/me', updateValidator, validate, AuthController.updateUser);

// ottieni informazioni utente per ID
router.get('/users/:id', AuthController.getUserById);

// manda informazioni sull'utente loggato
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'impossibile recuperare informazioni, utente non Autenticato.' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});


module.exports = router;