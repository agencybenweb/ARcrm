/**
 * Routes Utilisateurs (Commerciaux)
 * Alliance Renov CRM - Node.js
 */

const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/Utilisateur');
const Auth = require('../config/auth');
const db = require('../config/database');

// Liste des utilisateurs (commerciaux)
router.get('/', async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.getAll();
        res.json(utilisateurs);
    } catch (error) {
        console.error('Erreur getUtilisateurs:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Obtenir un utilisateur avec ses statistiques
router.get('/:id', async (req, res) => {
    try {
        const utilisateur = await Utilisateur.getById(req.params.id);
        if (!utilisateur) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Statistiques du commercial
        const stats = await getCommercialStats(req.params.id);
        utilisateur.stats = stats;

        res.json(utilisateur);
    } catch (error) {
        console.error('Erreur getUtilisateur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Statistiques d'un commercial
router.get('/:id/stats', async (req, res) => {
    try {
        const stats = await getCommercialStats(req.params.id);
        res.json(stats);
    } catch (error) {
        console.error('Erreur getCommercialStats:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Clients assignés à un commercial
router.get('/:id/clients', async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT c.*, 
                    COUNT(DISTINCT p.id) as nb_projets,
                    COUNT(DISTINCT d.id) as nb_devis
             FROM clients c
             LEFT JOIN projets p ON p.client_id = c.id
             LEFT JOIN devis d ON d.projet_id = p.id
             WHERE c.utilisateur_id = ?
             GROUP BY c.id
             ORDER BY c.date_creation DESC`,
            [req.params.id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Erreur getCommercialClients:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Projets assignés à un commercial
router.get('/:id/projets', async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT p.*, 
                    c.nom as client_nom, c.prenom as client_prenom,
                    COUNT(DISTINCT d.id) as nb_devis
             FROM projets p
             LEFT JOIN clients c ON p.client_id = c.id
             LEFT JOIN devis d ON d.projet_id = p.id
             WHERE p.utilisateur_id = ?
             GROUP BY p.id
             ORDER BY p.date_creation DESC`,
            [req.params.id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Erreur getCommercialProjets:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Devis assignés à un commercial
router.get('/:id/devis', async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT d.*, 
                    p.titre as projet_titre,
                    c.nom as client_nom, c.prenom as client_prenom,
                    a.nom_societe as artisan_nom
             FROM devis d
             LEFT JOIN projets p ON d.projet_id = p.id
             LEFT JOIN clients c ON p.client_id = c.id
             LEFT JOIN artisans a ON d.artisan_id = a.id
             WHERE d.utilisateur_id = ?
             ORDER BY d.date_creation DESC`,
            [req.params.id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Erreur getCommercialDevis:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Fonction helper pour calculer les statistiques d'un commercial
async function getCommercialStats(utilisateurId) {
    try {
        // Nombre de clients
        const [clients] = await db.execute(
            'SELECT COUNT(*) as total FROM clients WHERE utilisateur_id = ?',
            [utilisateurId]
        );
        const nb_clients = parseInt(clients[0]?.total) || 0;

        // Nombre de projets
        const [projets] = await db.execute(
            'SELECT COUNT(*) as total FROM projets WHERE utilisateur_id = ?',
            [utilisateurId]
        );
        const nb_projets = parseInt(projets[0]?.total) || 0;

        // Nombre de devis
        const [devis] = await db.execute(
            'SELECT COUNT(*) as total FROM devis WHERE utilisateur_id = ?',
            [utilisateurId]
        );
        const nb_devis = parseInt(devis[0]?.total) || 0;

        // Montant total des devis
        const [montantTotal] = await db.execute(
            'SELECT COALESCE(SUM(montant), 0) as total FROM devis WHERE utilisateur_id = ?',
            [utilisateurId]
        );
        const montant_total = parseFloat(montantTotal[0]?.total) || 0;

        // Commission totale
        const [commissionTotal] = await db.execute(
            'SELECT COALESCE(SUM(commission), 0) as total FROM devis WHERE utilisateur_id = ? AND statut = "accepte"',
            [utilisateurId]
        );
        const commission_totale = parseFloat(commissionTotal[0]?.total) || 0;

        // Devis acceptés
        const [devisAcceptes] = await db.execute(
            'SELECT COUNT(*) as total FROM devis WHERE utilisateur_id = ? AND statut = "accepte"',
            [utilisateurId]
        );
        const nb_devis_acceptes = parseInt(devisAcceptes[0]?.total) || 0;

        // Taux de conversion
        const taux_conversion = nb_devis > 0 ? ((nb_devis_acceptes / nb_devis) * 100).toFixed(1) : 0;

        // Projets en cours
        const [projetsEnCours] = await db.execute(
            'SELECT COUNT(*) as total FROM projets WHERE utilisateur_id = ? AND statut = "en_cours"',
            [utilisateurId]
        );
        const nb_projets_en_cours = parseInt(projetsEnCours[0]?.total) || 0;

        // Clients signés
        const [clientsSignes] = await db.execute(
            'SELECT COUNT(*) as total FROM clients WHERE utilisateur_id = ? AND statut = "signe"',
            [utilisateurId]
        );
        const nb_clients_signes = parseInt(clientsSignes[0]?.total) || 0;

        // Projets terminés
        const [projetsTermines] = await db.execute(
            'SELECT COUNT(*) as total FROM projets WHERE utilisateur_id = ? AND statut = "termine"',
            [utilisateurId]
        );
        const nb_projets_termines = parseInt(projetsTermines[0]?.total) || 0;

        return {
            nb_clients,
            nb_projets,
            nb_devis,
            montant_total,
            commission_totale,
            nb_devis_acceptes,
            taux_conversion,
            nb_projets_en_cours,
            nb_projets_termines,
            nb_clients_signes
        };
    } catch (error) {
        console.error('Erreur getCommercialStats:', error);
        return {
            nb_clients: 0,
            nb_projets: 0,
            nb_devis: 0,
            montant_total: 0,
            commission_totale: 0,
            nb_devis_acceptes: 0,
            taux_conversion: 0,
            nb_projets_en_cours: 0,
            nb_clients_signes: 0
        };
    }
}

module.exports = router;
