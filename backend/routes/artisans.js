/**
 * Routes Artisans
 * Alliance Renov CRM - Node.js
 */

const express = require('express');
const router = express.Router();
const Artisan = require('../models/Artisan');

router.get('/', async (req, res) => {
    try {
        const filters = {};
        if (req.query.metier) filters.metier = req.query.metier;
        if (req.query.actif !== undefined) filters.actif = req.query.actif;
        if (req.query.search) filters.search = req.query.search;

        const artisans = await Artisan.getAll(filters);
        res.json(artisans);
    } catch (error) {
        console.error('Erreur getArtisans:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const artisan = await Artisan.getById(req.params.id);
        if (artisan) {
            res.json(artisan);
        } else {
            res.status(404).json({ error: 'Artisan non trouvé' });
        }
    } catch (error) {
        console.error('Erreur getArtisan:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.nom_societe || !req.body.metier) {
            return res.status(400).json({ error: 'Nom de société et métier requis' });
        }

        const id = await Artisan.create(req.body);
        if (id) {
            res.status(201).json({ success: true, id });
        } else {
            res.status(500).json({ error: 'Erreur lors de la création' });
        }
    } catch (error) {
        console.error('Erreur createArtisan:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!req.body.nom_societe || !req.body.metier) {
            return res.status(400).json({ error: 'Nom de société et métier requis' });
        }

        const result = await Artisan.update(req.params.id, req.body);
        if (result) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Erreur lors de la mise à jour' });
        }
    } catch (error) {
        console.error('Erreur updateArtisan:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await Artisan.delete(req.params.id);
        if (result) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Erreur lors de la suppression' });
        }
    } catch (error) {
        console.error('Erreur deleteArtisan:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;

