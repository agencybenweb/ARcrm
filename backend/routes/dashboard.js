/**
 * Routes Dashboard
 * Alliance Renov CRM - Node.js
 */

const express = require('express');
const router = express.Router();
const Dashboard = require('../models/Dashboard');
const Relance = require('../models/Relance');
const Projet = require('../models/Projet');

router.get('/stats', async (req, res) => {
    try {
        console.log('Requête dashboard/stats reçue');
        const stats = await Dashboard.getStats();
        console.log('Stats calculées:', stats);
        
        try {
            stats.relances_prochaines = await Relance.getUpcoming(5);
            console.log('Relances prochaines:', stats.relances_prochaines.length);
        } catch (relanceError) {
            console.error('Erreur getUpcoming relances:', relanceError);
            stats.relances_prochaines = [];
        }
        try {
            stats.projets_recents = await Projet.getRecent(5);
            console.log('Projets récents:', stats.projets_recents.length);
        } catch (projetError) {
            console.error('Erreur getRecent projets:', projetError);
            stats.projets_recents = [];
        }
        
        console.log('Envoi des stats au client:', stats);
        res.json(stats);
    } catch (error) {
        console.error('Erreur getDashboardStats:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
});

module.exports = router;

