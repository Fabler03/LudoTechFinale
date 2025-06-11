//importo il db
const db = require('../db/database');

//importo il modulo bcryptjs per la gestione delle password
const bcrypt = require('bcryptjs');


//Interagisce direttamente con il database per le operazioni CRUD sugli utenti
class User {
  
  // creazione di un nuovo utente
  static async create({ username, email, password}) {
    // genSalt genera un seed casuale per l'hashing della password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const role = 'user'; // ruolo predefinito per i nuovi utenti
    
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, role],
        function(err) {
          if (err) reject(err);
          resolve({ id: this.lastID, username, email, role });
        }
      );
    });
  }

  // ricerca per username
  static async findByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  // ricerca per id
  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, username, email, avatar FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static async update (id, { username, email, avatar }) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET username = ?, email = ?, avatar = ? WHERE id = ?',
        [username, email, avatar, id],
        function(err) {
          if (err) reject(err);
          resolve({ id, username, email, avatar });
        }
      );
    });
  }

// confronta la password inserita con quella salvata nel db
  static async comparePassword(candidatePassword, hash) {
    return bcrypt.compare(candidatePassword, hash);
  }
}

module.exports = User;