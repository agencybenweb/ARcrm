/**
 * Routes Devis
 * Alliance Renov CRM - Node.js
 */

const express = require('express');
const router = express.Router();
const Devis = require('../models/Devis');
const Auth = require('../config/auth');

router.get('/', async (req, res) => {
    try {
        const filters = {};
        if (req.query.projet_id) filters.projet_id = req.query.projet_id;
        if (req.query.artisan_id) filters.artisan_id = req.query.artisan_id;
        if (req.query.statut) filters.statut = req.query.statut;

        const devis = await Devis.getAll(filters);
        res.json(devis);
    } catch (error) {
        console.error('Erreur getDevis:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Export CSV - DOIT être avant /:id
router.get('/export', async (req, res) => {
    try {
        const devis = await Devis.getAll();
        
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=devis_${new Date().toISOString().split('T')[0]}.csv`);

        // En-têtes avec BOM UTF-8 pour Excel
        res.write('\ufeff');
        res.write('ID;Numéro;Projet;Client;Artisan;Montant;Commission;Statut;Date devis;Date limite\n');

        devis.forEach(d => {
            const line = [
                d.id,
                escapeCSV(d.numero || ''),
                escapeCSV(d.projet_titre || ''),
                escapeCSV(`${d.client_prenom || ''} ${d.client_nom || ''}`.trim()),
                escapeCSV(d.artisan_nom || ''),
                d.montant || 0,
                d.commission || 0,
                escapeCSV(d.statut || ''),
                d.date_devis ? new Date(d.date_devis).toLocaleDateString('fr-FR') : '',
                d.date_limite ? new Date(d.date_limite).toLocaleDateString('fr-FR') : ''
            ].join(';') + '\n';
            res.write(line);
        });

        res.end();
    } catch (error) {
        console.error('Erreur exportDevis:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Fonction pour échapper les valeurs CSV
function escapeCSV(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    // Si la valeur contient un point-virgule, des guillemets ou un saut de ligne, l'entourer de guillemets
    if (str.includes(';') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

router.get('/:id', async (req, res) => {
    try {
        const devis = await Devis.getById(req.params.id);
        if (devis) {
            res.json(devis);
        } else {
            res.status(404).json({ error: 'Devis non trouvé' });
        }
    } catch (error) {
        console.error('Erreur getDevis:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.projet_id || !req.body.artisan_id || !req.body.montant || !req.body.date_devis) {
            return res.status(400).json({ error: 'Projet, artisan, montant et date requis' });
        }

        // Utiliser l'utilisateur_id du formulaire s'il est fourni, sinon utiliser l'utilisateur connecté
        if (!req.body.utilisateur_id) {
            req.body.utilisateur_id = Auth.getUserId(req);
        }
        const id = await Devis.create(req.body);

        if (id) {
            res.status(201).json({ success: true, id });
        } else {
            res.status(500).json({ error: 'Erreur lors de la création' });
        }
    } catch (error) {
        console.error('Erreur createDevis:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!req.body.projet_id || !req.body.artisan_id || !req.body.montant || !req.body.date_devis) {
            return res.status(400).json({ error: 'Projet, artisan, montant et date requis' });
        }

        // Utiliser l'utilisateur_id du formulaire s'il est fourni, sinon utiliser l'utilisateur connecté
        if (!req.body.utilisateur_id) {
            req.body.utilisateur_id = Auth.getUserId(req);
        }

        const result = await Devis.update(req.params.id, req.body);
        if (result) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Erreur lors de la mise à jour' });
        }
    } catch (error) {
        console.error('Erreur updateDevis:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await Devis.delete(req.params.id);
        if (result) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Erreur lors de la suppression' });
        }
    } catch (error) {
        console.error('Erreur deleteDevis:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;

