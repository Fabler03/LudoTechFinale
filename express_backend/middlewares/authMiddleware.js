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

// da implementare
function checkStaticAccess(req, res, next) {
  const origin = req.get('Origin') || '';
  const referer = req.get('Referer') || '';

  const allowedOrigin = 'http://localhost:4200';

  const fromFrontend = origin.startsWith(allowedOrigin) || referer.startsWith(allowedOrigin);

  if (fromFrontend) {
    // Aggiungi header CORS
    res.header('Access-Control-Allow-Origin', allowedOrigin);
    res.header('Access-Control-Allow-Credentials', 'true');
    return next();
  }

  return res.status(403).send('Accesso non autorizzato ai file statici');
}


module.exports = { 
    isAuthenticated,
    isAdmin,
    checkStaticAccess
};
