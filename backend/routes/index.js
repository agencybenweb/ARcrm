/**
 * Routes API
 * Alliance Renov CRM - Node.js
 */

const express = require('express');
const router = express.Router();

// Routes d'authentification
router.use('/auth', require('./auth'));

// Middleware d'authentification pour toutes les routes sauf auth
const Auth = require('../config/auth');
router.use((req, res, next) => {
    // Exclure les routes /auth du middleware
    if (req.path.startsWith('/auth')) {
        return next();
    }
    Auth.requireLogin(req, res, next);
});

// Autres routes
router.use('/clients', require('./clients'));
router.use('/projets', require('./projets'));
router.use('/artisans', require('./artisans'));
router.use('/devis', require('./devis'));
router.use('/relances', require('./relances'));
router.use('/dashboard', require('./dashboard'));
router.use('/utilisateurs', require('./utilisateurs'));

module.exports = router;

