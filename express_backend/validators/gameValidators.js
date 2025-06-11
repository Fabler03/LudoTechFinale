const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const uploadValidator = [
  body('name')
    .notEmpty().withMessage('Nome del gioco è obbligatorio')
    .isLength({ min: 3 }).withMessage('Il nome del gioco deve essere di almeno 3 caratteri')
    .isLength({ max: 50 }).withMessage('Il nome del gioco deve essere di massimo 50 caratteri')
    .custom((value) => {
      if (!/^[a-zA-Z0-9]+$/.test(value)) {
        throw new Error('Il nome del gioco può contenere solo lettere e numeri');
      }
      return true;
    })
    .custom(async (value) => {
      const gamePath = path.join(__dirname, '../uploads', value);
      if (fs.existsSync(gamePath)) {
        throw new Error('Il gioco esiste già.');
      }
      return true;
    }),

  body('description').notEmpty().withMessage('Descrizione del gioco è obbligatoria')
  .isLength({ min: 10 }).withMessage('La descrizione del gioco deve essere di almeno 10 caratteri')
  .isLength({ max: 1000 }).withMessage('La descrizione del gioco deve essere di massimo 1000 caratteri'),

  body('icon')
    .custom((value, { req }) => {
      if (!req.files || !req.files.icon) {
        throw new Error('Icona obbligatoria.');
      }
      return true;
    }),

  body('html')
    .custom((value, { req }) => {
      if (!req.files || !req.files.html) {
        throw new Error('File HTML obbligatorio.');
      }
      return true;
    }),

  body('js')
    .custom((value, { req }) => {
      if (!req.files || !req.files.js) {
        throw new Error('File JS obbligatorio.');
      }
      return true;
    }),

  body('css')
    .custom((value, { req }) => {
      if (!req.files || !req.files.css) {
        throw new Error('File CSS obbligatorio.');
      }
      return true;
    }),
];

// Raccoglie tutti gli errori di validazione usando validationResult(req)
// questo aggiunge uno strato intermedio che controlla se ci sono errori da altri validatori
// e se ci sono errori, restituisce un errore 400 con gli errori di validazione
// questo middleware viene eseguito dopo i validatori definiti sopra e può essere associato a quasiasi nuovo validatore
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Se ci sono errori di validazione, cancella i file temporanei
    // attualmente elimina i file temporanei anche se gli errori non sono legati al caricamento di giochi
    if (req.files) {
      Object.keys(req.files).forEach(field => {
        req.files[field].forEach(file => {
          try {
            fs.unlinkSync(file.path);
          } catch (err) {
            console.error(`errore nella cancellazione del file temporaneo ${file.path}:`, err.message);
          }
        });
      });
    }
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

module.exports = {
  uploadValidator,
  validate
};