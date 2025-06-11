const { body, validationResult } = require('express-validator');

// controllo che i campi siano valorizzati per la registrazione
const registerValidator = [
  body('username').notEmpty().withMessage('Username è obbligatorio'),
  body('email').isEmail().withMessage('Email non valida'),
  body('password').isLength({ min: 6 }).withMessage('Password deve essere di almeno 6 caratteri')
];

// controllo che i campi siano valorizzati per il login
const loginValidator = [
  body('username').notEmpty().withMessage('Username è obbligatorio'),
  body('password').notEmpty().withMessage('Password è obbligatoria')
];

// controllo che i campi siano valorizzati per il login
const updateValidator = [
  body('username').notEmpty().withMessage('Username è obbligatorio'),
  body('email').notEmpty().isEmail().withMessage('Email non valida'),
  body('avatar').optional()
];

// Raccoglie tutti gli errori di validazione usando validationResult(req)
// questo aggiunge uno strato intermedio che controlla se ci sono errori da altri validatori
// e se ci sono errori, restituisce un errore 400 con gli errori di validazione
// questo middleware viene eseguito dopo i validatori definiti sopra e può essere associato a quasiasi nuovo validatore
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

module.exports = {
  registerValidator,
  loginValidator,
  updateValidator,
  validate
};