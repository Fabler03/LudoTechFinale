//import del modulo sqlite3
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

//creazione della connessione al database SQLite
const db = new sqlite3.Database('./db/database.sqlite', (err) => {
  if (err) {
    console.error('Errore connessione al database:', err.message);
  } else {
    console.log('Connesso al database SQLite');
  }
});

//creazione del database e dell'utente admin
async function initializeDatabase() {
  try {
    const hashedPassword = await bcrypt.hash("password", 10);

    // Abilita il supporto per le chiavi esterne
    db.run('PRAGMA foreign_keys = ON;', (error) => {
      if (error) {
        console.error('errore foreign keys:', error.message);
      } else {
        console.log('Supporto per le chiavi esterne abilitato');
      }
    });


    // Crea le tabelle se non esistono
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          avatar TEXT DEFAULT 'panda.png',
          role TEXT NOT NULL DEFAULT 'user'
        )`);
        db.run(`INSERT OR IGNORE INTO users (username, email, password, avatar, role) VALUES
          ('admin', 'admin@mail.com', ?, 'panda.png', 'admin')`, [hashedPassword]);
        db.run(`CREATE TABLE IF NOT EXISTS games (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          description TEXT NOT NULL,
          author INTEGER NOT NULL,
          approvedby INTEGER,
          html TEXT NOT NULL,
          css TEXT NOT NULL,
          js TEXT NOT NULL,
          icon TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (author) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (approvedby) REFERENCES users(id) ON DELETE SET NULL
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS scores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          game_id INTEGER NOT NULL,
          score NUMERIC NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
        )`);
        resolve();
      });
    });
  } catch (error) {
    console.error('Errore durante l\'inizializzazione del database:', error.message);
  }
}

initializeDatabase();

module.exports = db;