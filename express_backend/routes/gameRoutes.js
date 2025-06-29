const express = require('express');
const router = express.Router();
const GameController = require('../controllers/gameControllers.js');
const { uploadMiddleware } = require('../middlewares/multerConfig.js');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware.js');
const { uploadValidator, validate } = require('../validators/gameValidators.js');

// Upload gioco
router.post(
  "/upload",
  isAuthenticated,
  uploadMiddleware, // gestisci upload
  uploadValidator,  // Valida la richiesta
  validate,         // Controlla gli errori di validazione
  GameController.uploadGame // Elabora l'upload
);

router.get('/download/:id', isAdmin, GameController.downloadGame); // download gioco per ID

router.put('/approve/:id', isAdmin, GameController.approveGame); // Approva un gioco per ID

router.post('/uploadScore', isAuthenticated, GameController.uploadScore);  // carica punteggio

router.get('/scores/:id', isAuthenticated, GameController.listScores); // ottieni punteggi

router.get('/', isAuthenticated, GameController.listApprovedGames); // Ottieni i giochi approvati

router.get('/unapproved', isAdmin, GameController.listUnapprovedGames); // Ottieni i giochi non ancora approvati

router.get('/:id', isAuthenticated, GameController.getGameById); // Ottieni un gioco per ID
// se l'utente che chiede il gioco non è admin, il backend ritorna il gioco solo se già approvato

router.delete('/:id', isAdmin, GameController.deleteGame); // Elimina un gioco per ID

module.exports = router;