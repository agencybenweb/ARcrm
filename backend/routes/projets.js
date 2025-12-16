/**
 * Routes Projets
 * Alliance Renov CRM - Node.js
 */

const express = require('express');
const router = express.Router();
const Projet = require('../models/Projet');
const Auth = require('../config/auth');

router.get('/', async (req, res) => {
    try {
        const filters = {};
        if (req.query.client_id) filters.client_id = req.query.client_id;
        if (req.query.statut) filters.statut = req.query.statut;
        if (req.query.search) filters.search = req.query.search;

        const projets = await Projet.getAll(filters);
        res.json(projets);
    } catch (error) {
        console.error('Erreur getProjets:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const projet = await Projet.getById(req.params.id);
        if (projet) {
            res.json(projet);
        } else {
            res.status(404).json({ error: 'Projet non trouvé' });
        }
    } catch (error) {
        console.error('Erreur getProjet:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.client_id || !req.body.titre || !req.body.type_travaux) {
            return res.status(400).json({ error: 'Client, titre et type de travaux requis' });
        }

        // Utiliser l'utilisateur_id du formulaire s'il est fourni, sinon utiliser l'utilisateur connecté
        if (!req.body.utilisateur_id) {
            req.body.utilisateur_id = Auth.getUserId(req);
        }
        const id = await Projet.create(req.body);

        if (id) {
            res.status(201).json({ success: true, id });
        } else {
            res.status(500).json({ error: 'Erreur lors de la création' });
        }
    } catch (error) {
        console.error('Erreur createProjet:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!req.body.client_id || !req.body.titre || !req.body.type_travaux) {
            return res.status(400).json({ error: 'Client, titre et type de travaux requis' });
        }

        // Utiliser l'utilisateur_id du formulaire s'il est fourni, sinon utiliser l'utilisateur connecté
        if (!req.body.utilisateur_id) {
            req.body.utilisateur_id = Auth.getUserId(req);
        }

        const result = await Projet.update(req.params.id, req.body);
        if (result) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Erreur lors de la mise à jour' });
        }
    } catch (error) {
        console.error('Erreur updateProjet:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await Projet.delete(req.params.id);
        if (result) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Erreur lors de la suppression' });
        }
    } catch (error) {
        console.error('Erreur deleteProjet:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;

