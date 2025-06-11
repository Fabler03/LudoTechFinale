const AuthService = require('../services/authServices.js');

class AuthController {
  static async register(req, res) {
    try {
      const user = await AuthService.registerUser(req.body);
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await AuthService.authenticate(username, password);

      req.session.user = {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role
      };
      
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await AuthService.getUserById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utente non trovato'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id, username, email, avatar } = req.body;
      const user = await AuthService.updateUser(id, { username, email, avatar });

      if (!req.session.user || req.session.user.id !== user.id) {
        return res.status(403).json({
          success: false,
          message: 'Accesso negato. Non puoi modificare i dati di un altro utente.'
        });
      }

      // Aggiorna la sessione con i nuovi dati dell'utente
      const role = req.session.user.role; // Mantieni il ruolo dell'utente
      req.session.user = {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: role
      };
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = AuthController;