/**
 * Modèle Dashboard
 * Alliance Renov CRM - Node.js
 */

const db = require('../config/database');

class Dashboard {
    static async getStats() {
        const stats = {};

        try {
            // Nombre de clients
            const [clients] = await db.execute('SELECT COUNT(*) as total FROM clients');
            stats.nb_clients = parseInt(clients[0]?.total) || 0;
            console.log('Nombre de clients:', stats.nb_clients);
        } catch (error) {
            console.error('Erreur nb_clients:', error);
            stats.nb_clients = 0;
        }

        try {
            // Projets en cours
            const [projets] = await db.execute("SELECT COUNT(*) as total FROM projets WHERE statut = 'en_cours'");
            stats.projets_en_cours = parseInt(projets[0]?.total) || 0;
            console.log('Projets en cours:', stats.projets_en_cours);
        } catch (error) {
            console.error('Erreur projets_en_cours:', error);
            stats.projets_en_cours = 0;
        }

        try {
            // Devis en attente
            const [devis] = await db.execute("SELECT COUNT(*) as total FROM devis WHERE statut = 'envoye'");
            stats.devis_en_attente = parseInt(devis[0]?.total) || 0;
            console.log('Devis en attente:', stats.devis_en_attente);
        } catch (error) {
            console.error('Erreur devis_en_attente:', error);
            stats.devis_en_attente = 0;
        }

        try {
            // Relances à venir (toutes les relances à faire avec date >= aujourd'hui)
            const [relances] = await db.execute(
                `SELECT COUNT(*) as total 
                 FROM relances 
                 WHERE statut = 'a_faire' 
                 AND DATE(date_programmee) >= CURDATE()`
            );
            stats.relances_a_venir = parseInt(relances[0]?.total) || 0;
            console.log('Relances à venir:', stats.relances_a_venir);
        } catch (error) {
            console.error('Erreur relances_a_venir:', error);
            stats.relances_a_venir = 0;
        }

        try {
            // Montant total des devis acceptés
            const [montant] = await db.execute(
                "SELECT COALESCE(SUM(montant), 0) as total FROM devis WHERE statut = 'accepte'"
            );
            stats.montant_total_devis = parseFloat(montant[0]?.total || 0);
        } catch (error) {
            console.error('Erreur montant_total_devis:', error);
            stats.montant_total_devis = 0;
        }

        try {
            // Commission potentielle
            const [commission] = await db.execute(
                "SELECT COALESCE(SUM(commission), 0) as total FROM devis WHERE statut = 'accepte'"
            );
            stats.commission_potentielle = parseFloat(commission[0]?.total || 0);
        } catch (error) {
            console.error('Erreur commission_potentielle:', error);
            stats.commission_potentielle = 0;
        }

        try {
            // Commission en attente
            const [commissionAttente] = await db.execute(
                "SELECT COALESCE(SUM(commission), 0) as total FROM devis WHERE statut = 'envoye'"
            );
            stats.commission_en_attente = parseFloat(commissionAttente[0]?.total || 0);
        } catch (error) {
            console.error('Erreur commission_en_attente:', error);
            stats.commission_en_attente = 0;
        }

        return stats;
    }
}

module.exports = Dashboard;

