const { check } = require("express-validator");

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  console.error('utente non loggato');
  return res.status(401).json({ message: 'Utente non loggato' });
}

function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Accesso riservato agli admin' });
}

module.exports = { 
    isAuthenticated,
    isAdmin,
};
