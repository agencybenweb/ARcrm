/**
 * Routes d'authentification
 * Alliance Renov CRM - Node.js
 */

const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/Utilisateur');
const Auth = require('../config/auth');

// Connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        const user = await Utilisateur.authenticate(email, password);

        if (user) {
            Auth.login(req, user.id, user.role, `${user.prenom} ${user.nom}`);
            res.json({
                success: true,
                user: {
                    id: user.id,
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({ error: 'Identifiants incorrects' });
        }
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Déconnexion
router.post('/logout', (req, res) => {
    Auth.logout(req);
    res.json({ success: true });
});

// Vérifier la session
router.get('/check', async (req, res) => {
    try {
        if (Auth.isLoggedIn(req)) {
            const user = await Utilisateur.getById(Auth.getUserId(req));
            if (user) {
                return res.json({
                    authenticated: true,
                    user: {
                        id: user.id,
                        nom: user.nom,
                        prenom: user.prenom,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        }
        res.json({ authenticated: false });
    } catch (error) {
        console.error('Erreur check:', error);
        res.json({ authenticated: false });
    }
});

module.exports = router;

