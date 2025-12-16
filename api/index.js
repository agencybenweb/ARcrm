/**
 * Vercel Serverless Function
 * Alliance Renov CRM - API Handler
 */

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const MemoryStore = require('memorystore')(session);

const app = express();

// Configuration CORS pour Vercel
// Important: utiliser l'origine réelle de la requête pour permettre les cookies
app.use(cors({
    origin: function (origin, callback) {
        // Autoriser les requêtes sans origine (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        // Autoriser toutes les origines en développement, ou l'origine spécifiée en production
        const allowedOrigins = process.env.FRONTEND_URL 
            ? [process.env.FRONTEND_URL, 'http://localhost:3000']
            : ['*'];
        if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Autoriser quand même pour le moment
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration des sessions pour Vercel (MemoryStore)
app.use(session({
    secret: process.env.SESSION_SECRET || 'alliance-renov-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
        checkPeriod: 86400000 // 24 heures
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 30 * 60 * 1000 // 30 minutes
    }
}));

// Routes API
// Note: Vercel route déjà vers /api, donc on utilise directement les routes
app.use('/', require('../backend/routes'));

// Handler pour Vercel - doit exporter une fonction (req, res)
module.exports = (req, res) => {
    // Vercel passe req et res directement, pas besoin de app.listen
    return app(req, res);
};

