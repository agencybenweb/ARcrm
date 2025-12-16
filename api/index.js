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

// Middleware de debug pour Vercel
app.use((req, res, next) => {
    console.log('🔍 Vercel Request:', {
        method: req.method,
        path: req.path,
        url: req.url,
        originalUrl: req.originalUrl,
        baseUrl: req.baseUrl
    });
    next();
});

// Routes API
// Vercel route /api/* vers cette fonction, donc on monte les routes à /
app.use('/', require('../backend/routes'));

// Handler pour Vercel - Express app directement
// Vercel détecte automatiquement l'app Express avec @vercel/node
module.exports = app;

