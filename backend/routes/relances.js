/**
 * Routes Relances
 * Alliance Renov CRM - Node.js
 */

const express = require('express');
const router = express.Router();
const Relance = require('../models/Relance');
const Auth = require('../config/auth');

router.get('/', async (req, res) => {
    try {
        const filters = {};
        if (req.query.client_id) filters.client_id = req.query.client_id;
        if (req.query.projet_id) filters.projet_id = req.query.projet_id;
        if (req.query.devis_id) filters.devis_id = req.query.devis_id;
        if (req.query.statut) filters.statut = req.query.statut;
        if (req.query.type) filters.type = req.query.type;

        const relances = await Relance.getAll(filters);
        res.json(relances);
    } catch (error) {
        console.error('Erreur getRelances:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const relance = await Relance.getById(req.params.id);
        if (relance) {
            res.json(relance);
        } else {
            res.status(404).json({ error: 'Relance non trouvée' });
        }
    } catch (error) {
        console.error('Erreur getRelance:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.type || !req.body.titre || !req.body.date_programmee) {
            return res.status(400).json({ error: 'Type, titre et date programmée requis' });
        }

        req.body.utilisateur_id = Auth.getUserId(req);
        const id = await Relance.create(req.body);

        if (id) {
            res.status(201).json({ success: true, id });
        } else {
            res.status(500).json({ error: 'Erreur lors de la création' });
        }
    } catch (error) {
        console.error('Erreur createRelance:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!req.body.type || !req.body.titre || !req.body.date_programmee) {
            return res.status(400).json({ error: 'Type, titre et date programmée requis' });
        }

        // Ajouter l'utilisateur_id depuis la session
        req.body.utilisateur_id = Auth.getUserId(req);

        const result = await Relance.update(req.params.id, req.body);
        if (result) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Erreur lors de la mise à jour' });
        }
    } catch (error) {
        console.error('Erreur updateRelance:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await Relance.delete(req.params.id);
        if (result) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Erreur lors de la suppression' });
        }
    } catch (error) {
        console.error('Erreur deleteRelance:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.get('/upcoming', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const relances = await Relance.getUpcoming(limit);
        res.json(relances);
    } catch (error) {
        console.error('Erreur getUpcomingRelances:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;

