const db = require('../db/database');

class Game {
  static async create({ name, description, author, isAdmin, files }) {
    try {
      // il campo approvedby andrà a contenere l'admin che approva il gioco
      // se l'utente che crea il gioco è un admin, allora il gioco è già approvato 
      // e approvedby sarà l'autore
      let approvedby = null;
      if (isAdmin) {
        approvedby = author;
      }

      // inserimento nel DB
      return new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO games (name, description, author, approvedby, html, css, js, icon)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            name,
            description,
            author,
            approvedby,
            files.html,
            files.css,
            files.js,
            files.icon
          ],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({
                id: this.lastID,
                name,
                description,
                author,
                approvedby,
                files
              });
            }
          }
        );
      });
    } catch (err) {
      throw new Error(`Error creating game: ${err.message}`);
    }
  }

  static async createScore(userId, gameId, score) {
    try {
      return new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO scores (user_id, game_id, score) VALUES (?, ?, ?)`,
          [userId, gameId, score],
          function (err) {
            if (err) {
              return reject(err);
            }
            resolve({id: this.lastID});
          }
        );
      });
    } catch (err) {
      throw new Error(`Errore nella creazione del punteggio: ${err.message}`);
    }
  } 

  static async getGameScores(gameId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
            scores.id, 
            games.name AS gamename,
            users.username,
            users.avatar,
            scores.score,
            scores.created_at 
        FROM scores 
        JOIN games ON scores.game_id = games.id 
        JOIN users ON scores.user_id = users.id 
        WHERE scores.game_id = ?
        ORDER BY scores.score DESC
        LIMIT 10`,
        [gameId],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

  // la lascio perchè può servire, ma non viene mai utilizzata
  static async getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM games', [], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static async getApproved() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM games WHERE approvedby IS NOT NULL', [], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static async getUnapproved() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM games WHERE approvedby IS NULL', [], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static async findById(id, isAdmin) {
    return new Promise((resolve, reject) => {
      if (isAdmin) {
        db.get('SELECT * FROM games WHERE id = ?', [id], (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      } else {
        // se user non è admin non restituire giochi non approvati
        db.get('SELECT * FROM games WHERE id = ? AND approvedby IS NOT NULL', [id], (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      }
    });
  }

  static async approve(gameId, approvedby) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE games SET approvedby = ? WHERE id = ?',
        [approvedby, gameId],
        function (err) {
          if (err) reject(err);
          resolve({ updated: this.changes > 0 });
        }
      );
    });
  }

  static async deleteById(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM games WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        resolve({ deleted: this.changes > 0 });
      });
    });
  }
}

module.exports = Game;
