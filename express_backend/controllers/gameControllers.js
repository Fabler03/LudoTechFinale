const GameService = require('../services/gameServices');

class GameController {
  static async uploadGame(req, res) {
    try {
      const { name, description } = req.body;
      const author = req.session.user.id;
      const isAdmin = req.session.user.role == 'admin';
      const files = req.files;

      if (!files || !files.html || !files.css || !files.js || !files.icon) {
        return res.status(400).json({ success: false, message: 'Impossibile caricare il gioco, file necessari mancanti.' });
      }

      const newGame = await GameService.uploadGame({ name, description, author, isAdmin, files });

      const msg = isAdmin ? 'Gioco caricato con successo e automaticamente approvato!' : 'Gioco caricato con successo, il nostro staff lo approverà al più presto!'
      res.status(201).json({
        success: true,
        message: msg,
        data: newGame
      });
    } catch (err) {
      console.error('Error uploading game:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async downloadGame(req, res) {
    try {
      const id = req.params.id;
      const { archive, gameName } = await GameService.prepareGameZip(id);

      res.setHeader('Content-Disposition', `attachment; filename="${gameName}.zip"`);
      res.setHeader('Content-Type', 'application/zip');

      archive.on('error', err => {
        throw err;
      });

      archive.pipe(res);
      await archive.finalize();

    } catch (err) {
      console.error('Errore durante il download del gioco:', err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  }



  static async uploadScore(req, res) {
    const { gameId, score } = req.body;

    if (typeof score !== 'number' || isNaN(score || score < 0)) {
      return res.status(400).json({success: false, message: 'punteggio non valido'});
    }

    try{
      const userId = req.session.user.id;

      await GameService.uploadScore(userId, gameId, score);

    } catch (err) {
      console.error("Errore nel caricamento del punteggio: ", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async listScores(req, res) {
    try {
      const gameId = req.params.id;

      const scores = await GameService.getGameScores(gameId);
      res.json({ success: true, scores: scores });
    } catch (err) {
      console.error('Impossibile recuperare i punteggi: ', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async listApprovedGames(req, res) {
    try {
      const games = await GameService.listApprovedGames();
      res.json({ success: true, games: games });
    } catch (err) {
      console.error('Impossibile recuperare i giochi: ', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async listUnapprovedGames(req, res) {
    try {
      const games = await GameService.listUnapprovedGames();
      res.json({ success: true, games: games });
    } catch (err) {
      console.error('Impossibile recuperare i giochi: ', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getGameById(req, res) {
    try {
      const id = req.params.id;
      const isAdmin = req.session.user.role == 'admin';
      
      const game = await GameService.getGameById(id, isAdmin);
      if (!game) {
        return res.status(404).json({ success: false, message: 'Gioco non trovato.' });
      }
      res.json({ success: true, game: game });
    } catch (err) {
      console.error('Impossibile recuperare il gioco: ', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async approveGame(req, res) {
    try {
      const id = req.params.id;
      const approvedby = req.session.user.id;

      const game = await GameService.approveGame(id, approvedby);

      res.json({ success: true, message: 'Gioco approvato con successo', game: game });
    } catch (err) {
      console.error('Impossibile approvare il gioco: ', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async deleteGame(req, res) {
    try {
      const id = req.params.id;
      await GameService.deleteGame(id);
      res.json({ success: true, message: 'Gioco eliminato con successo' });
    } catch (err) {
      console.error('Impossibile eliminare il gioco: ', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

}

module.exports = GameController;