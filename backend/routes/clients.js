/**
 * Routes Clients
 * Alliance Renov CRM - Node.js
 */

const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const Auth = require('../config/auth');

// Liste des clients
router.get('/', async (req, res) => {
    try {
        const filters = {};
        if (req.query.search) filters.search = req.query.search;
        if (req.query.statut) filters.statut = req.query.statut;

        const clients = await Client.getAll(filters);
        res.json(clients);
    } catch (error) {
        console.error('Erreur getClients:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Export CSV - DOIT être avant /:id
router.get('/export', async (req, res) => {
    try {
        const clients = await Client.getAll();
        
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=clients_${new Date().toISOString().split('T')[0]}.csv`);

        // En-têtes avec BOM UTF-8 pour Excel
        res.write('\ufeff');
        res.write('ID;Nom;Prénom;Téléphone;Email;Adresse;Code Postal;Ville;Source;Statut;Date création\n');

        // Données
        clients.forEach(client => {
            const line = [
                client.id,
                escapeCSV(client.nom || ''),
                escapeCSV(client.prenom || ''),
                escapeCSV(client.telephone || ''),
                escapeCSV(client.email || ''),
                escapeCSV(client.adresse_projet || ''),
                escapeCSV(client.code_postal || ''),
                escapeCSV(client.ville || ''),
                escapeCSV(client.source_lead || ''),
                escapeCSV(client.statut || ''),
                client.date_creation ? new Date(client.date_creation).toLocaleDateString('fr-FR') : ''
            ].join(';') + '\n';
            res.write(line);
        });

        res.end();
    } catch (error) {
        console.error('Erreur exportClients:', error);
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

// Obtenir un client
router.get('/:id', async (req, res) => {
    try {
        const client = await Client.getById(req.params.id);
        if (client) {
            client.historique = await Client.getHistory(req.params.id);
            res.json(client);
        } else {
            res.status(404).json({ error: 'Client non trouvé' });
        }
    } catch (error) {
        console.error('Erreur getClient:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Créer un client
router.post('/', async (req, res) => {
    try {
        if (!req.body.nom || !req.body.prenom) {
            return res.status(400).json({ error: 'Nom et prénom requis' });
        }

        // Utiliser l'utilisateur_id du formulaire s'il est fourni, sinon utiliser l'utilisateur connecté
        if (!req.body.utilisateur_id) {
            req.body.utilisateur_id = Auth.getUserId(req);
        }
        const id = await Client.create(req.body);

        if (id) {
            res.status(201).json({ success: true, id });
        } else {
            res.status(500).json({ error: 'Erreur lors de la création' });
        }
    } catch (error) {
        console.error('Erreur createClient:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Mettre à jour un client
router.put('/:id', async (req, res) => {
    try {
        if (!req.body.nom || !req.body.prenom) {
            return res.status(400).json({ error: 'Nom et prénom requis' });
        }

        // Utiliser l'utilisateur_id du formulaire s'il est fourni, sinon utiliser l'utilisateur connecté
        if (!req.body.utilisateur_id) {
            req.body.utilisateur_id = Auth.getUserId(req);
        }

        const result = await Client.update(req.params.id, req.body);
        if (result) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Erreur lors de la mise à jour' });
        }
    } catch (error) {
        console.error('Erreur updateClient:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
});

// Supprimer un client
router.delete('/:id', async (req, res) => {
    try {
        const result = await Client.delete(req.params.id);
        if (result) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Erreur lors de la suppression' });
        }
    } catch (error) {
        console.error('Erreur deleteClient:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;

