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
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
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

// Handler pour Vercel
module.exports = app;

