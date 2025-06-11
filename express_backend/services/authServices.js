//import modello
const User = require('../models/user');

class AuthService {
  static async registerUser(userData) {
    try {
      // Controlla se l'username è già in uso
      const existingUser = await User.findByUsername(userData.username);
      if (existingUser) {
        throw new Error('Username già in uso');
      }

      return await User.create(userData);
    } catch (error) {
      // Gestione degli errori
      if (error.code === 'SQLITE_CONSTRAINT') {
        if (error.message.includes('users.email')) {
          throw new Error('Email già in uso');
        }

        throw new Error('Errore durante la registrazione dell\'utente');
      }
      
      throw error;
    }
  }

  static async authenticate(username, password) {
    try {
      // Trova l'utente in base all'username
      const user = await User.findByUsername(username);
      if (!user) {
        throw new Error('Credenziali non valide');
      }
      // check se la password è corretta
      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        throw new Error('Credenziali non valide');
      }

      // Escludi la password dalla risposta
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      // Trova l'utente in base all'ID
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Utente non trovato');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(userId, userData) {
    try {
      // Trova l'utente in base all'ID
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Utente non trovato');
      }

      // Aggiorna i dati dell'utente
      const updatedUser = await User.update(userId, userData);
      return updatedUser;
    } catch (error) {
      // Gestione degli errori
      if (error.code === 'SQLITE_CONSTRAINT') {
        if (error.message.includes('users.email')) {
          throw new Error('Email già in uso');
        } else if (error.message.includes('users.username')) {
          throw new Error('Username già in uso');
        }

        throw new Error('Errore durante l\'aggiornamento dati utente');
      }
      
      throw error;
    }
  }
}

module.exports = AuthService;