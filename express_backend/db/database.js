//import del modulo sqlite3
const sqlite3 = require('sqlite3').verbose();

//creazione del database e della tabella users
const db = new sqlite3.Database('./db/database.sqlite', (err) => {
  if (err) {
    console.error('Errore connessione al database:', err.message);
  } else {
    console.log('Connesso al database SQLite');
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT DEFAULT 'panda.png',
      role TEXT NOT NULL DEFAULT 'user'
    )`);
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
  }
});

module.exports = db;