const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes.js');
const gameRoutes = require('./routes/gameRoutes.js');
const { checkStaticAccess } = require('./middlewares/authMiddleware');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

app.use(cookieParser());

app.use(session({
  secret: 'chiave_segretissima_ludotech_v1', // usa una variabile d'ambiente!
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // metti true in produzione con HTTPS
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 // 1 giorno
  }
}));


const cors = require('cors'); // Importiamo il modulo cors per gestire le richieste cross-origin (dal frontend)
const path = require('path');

/*
app.use(cors({
  origin: 'http://localhost:4200', // URL frontend angular
  credentials: true
}));
*/

app.use(cors({
    origin: (origin, callback) => {
        // accetta richieste da localhost, sia HTTP che Capacitor
        if (!origin ||
            origin.startsWith('http://localhost') ||
            origin.startsWith('capacitor://localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
            console.log('CORS error: Origin not allowed:', origin);
        }
    },
    credentials: true
}));

// Middleware che permette di ritornare json
app.use(express.json());

// Routes definite nel file authroutes
app.use('/api/auth', authRoutes);

// Routes definite nel file gameroutes
app.use('/api/games', gameRoutes);

// permetti al server di utilizzare i file statici nella cartella uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// accessibili tramite http://localhost:3000/uploads/NOME_CARTELLA/NOME_FILE

// Intercetta errori del server
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Errore interno del server' });
});

// Avvio server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});