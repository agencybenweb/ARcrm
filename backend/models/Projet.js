/**
 * Modèle Projet
 * Alliance Renov CRM - Node.js
 */

const db = require('../config/database');

class Projet {
    static async getAll(filters = {}) {
        let sql = `
            SELECT p.*, 
                   c.nom as client_nom, c.prenom as client_prenom,
                   u.nom as utilisateur_nom, u.prenom as utilisateur_prenom,
                   COUNT(DISTINCT d.id) as nb_devis
            FROM projets p
            LEFT JOIN clients c ON p.client_id = c.id
            LEFT JOIN utilisateurs u ON p.utilisateur_id = u.id
            LEFT JOIN devis d ON d.projet_id = p.id
        `;

        const conditions = [];
        const params = [];

        if (filters.client_id) {
            conditions.push('p.client_id = ?');
            params.push(filters.client_id);
        }

        if (filters.statut) {
            conditions.push('p.statut = ?');
            params.push(filters.statut);
        }

        if (filters.search) {
            conditions.push('(p.titre LIKE ? OR p.type_travaux LIKE ?)');
            const search = `%${filters.search}%`;
            params.push(search, search);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' GROUP BY p.id ORDER BY p.date_debut DESC, p.date_creation DESC';

        const [rows] = await db.execute(sql, params);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute(
            `SELECT p.*, 
                    c.nom as client_nom, c.prenom as client_prenom, c.telephone as client_telephone,
                    u.nom as utilisateur_nom, u.prenom as utilisateur_prenom,
                    (SELECT COUNT(*) FROM devis WHERE projet_id = p.id) as nb_devis
             FROM projets p
             LEFT JOIN clients c ON p.client_id = c.id
             LEFT JOIN utilisateurs u ON p.utilisateur_id = u.id
             WHERE p.id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    static async create(data) {
        const [result] = await db.execute(
            `INSERT INTO projets (
                client_id, titre, type_travaux, budget_estime, 
                date_debut, statut, notes, utilisateur_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.client_id,
                data.titre,
                data.type_travaux,
                data.budget_estime || null,
                data.date_debut || null,
                data.statut || 'a_etudier',
                data.notes || null,
                data.utilisateur_id || null
            ]
        );

        if (result.insertId) {
            await this.logAction('projet', result.insertId, 'create', 'Projet créé', data.utilisateur_id);
        }

        return result.insertId;
    }

    static async update(id, data) {
        try {
            // Récupérer l'ancien statut et le client_id avant la mise à jour
            const [oldProject] = await db.execute(
                'SELECT statut, client_id, utilisateur_id FROM projets WHERE id = ?',
                [id]
            );
            const oldStatut = oldProject[0]?.statut;
            const clientId = oldProject[0]?.client_id || parseInt(data.client_id);
            const commercialId = oldProject[0]?.utilisateur_id || data.utilisateur_id || null;
            const newStatut = data.statut || 'a_etudier';

            // Convertir budget_estime en nombre si c'est une chaîne
            const budget = data.budget_estime ? parseFloat(data.budget_estime) : null;
            
            const [result] = await db.execute(
                `UPDATE projets SET
                    client_id = ?, titre = ?, type_travaux = ?, budget_estime = ?,
                    date_debut = ?, statut = ?, notes = ?, utilisateur_id = ?,
                    date_modification = NOW()
                WHERE id = ?`,
                [
                    parseInt(data.client_id),
                    data.titre,
                    data.type_travaux,
                    budget,
                    data.date_debut || null,
                    newStatut,
                    data.notes || null,
                    data.utilisateur_id || null,
                    parseInt(id)
                ]
            );

            if (result.affectedRows > 0) {
                const userId = data.utilisateur_id || null;
                await this.logAction('projet', id, 'update', 'Projet modifié', userId);

                // Si le projet vient d'être marqué comme terminé
                if (newStatut === 'termine' && oldStatut !== 'termine') {
                    console.log(`Projet ${id} marqué comme terminé - Mise à jour des statistiques...`);
                    
                    // Ajouter une date de fin si elle n'existe pas
                    await db.execute(
                        'UPDATE projets SET date_debut = COALESCE(date_debut, CURDATE()) WHERE id = ? AND date_debut IS NULL',
                        [id]
                    );
                    
                    // Mettre à jour le statut du client si tous ses projets sont terminés
                    await this.updateClientStatusIfAllProjectsCompleted(clientId);
                    
                    // Mettre à jour les devis liés
                    await this.updateRelatedDevis(id);
                    
                    // Mettre à jour les statistiques du commercial (via log)
                    if (commercialId) {
                        await this.logAction('projet', id, 'complete', `Projet terminé - Statistiques mises à jour`, commercialId);
                    }
                    
                    console.log(`✅ Projet ${id} terminé - Toutes les mises à jour effectuées`);
                }
            }

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erreur update projet:', error);
            throw error;
        }
    }

    // Mettre à jour le statut du client si tous ses projets sont terminés
    static async updateClientStatusIfAllProjectsCompleted(clientId) {
        try {
            // Vérifier si tous les projets du client sont terminés
            const [projets] = await db.execute(
                'SELECT COUNT(*) as total, SUM(CASE WHEN statut = "termine" THEN 1 ELSE 0 END) as termines FROM projets WHERE client_id = ?',
                [clientId]
            );

            const total = parseInt(projets[0]?.total) || 0;
            const termines = parseInt(projets[0]?.termines) || 0;

            // Si tous les projets sont terminés et qu'il y a au moins un projet
            if (total > 0 && total === termines) {
                // Mettre à jour le statut du client à "signe" (travaux terminés)
                await db.execute(
                    'UPDATE clients SET statut = "signe", date_modification = NOW() WHERE id = ? AND statut != "signe"',
                    [clientId]
                );
                console.log(`Client ${clientId} mis à jour: tous les projets sont terminés`);
            }
        } catch (error) {
            console.error('Erreur updateClientStatusIfAllProjectsCompleted:', error);
        }
    }

    // Mettre à jour les devis liés au projet
    static async updateRelatedDevis(projetId) {
        try {
            // Récupérer tous les devis acceptés du projet
            const [devisAcceptes] = await db.execute(
                'SELECT id, utilisateur_id FROM devis WHERE projet_id = ? AND statut = "accepte"',
                [projetId]
            );

            // Les devis sont déjà à jour, mais on peut ajouter une date de fin de projet
            // ou d'autres logiques si nécessaire
            console.log(`${devisAcceptes.length} devis acceptés liés au projet ${projetId}`);
        } catch (error) {
            console.error('Erreur updateRelatedDevis:', error);
        }
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM projets WHERE id = ?', [id]);

        if (result.affectedRows > 0) {
            await this.logAction('projet', id, 'delete', 'Projet supprimé', null);
        }

        return result.affectedRows > 0;
    }

    static async getRecent(limit = 5) {
        try {
            const limitNum = parseInt(limit, 10);
            const [rows] = await db.execute(
                `SELECT p.*, 
                        c.nom as client_nom, c.prenom as client_prenom
                 FROM projets p
                 LEFT JOIN clients c ON p.client_id = c.id
                 ORDER BY p.date_creation DESC
                 LIMIT ?`,
                [limitNum]
            );
            return rows || [];
        } catch (error) {
            console.error('Erreur getRecent projets:', error);
            return [];
        }
    }

    static async logAction(type, entiteId, action, description, userId) {
        try {
            await db.execute(
                'INSERT INTO historique_actions (type_entite, entite_id, action, description, utilisateur_id) VALUES (?, ?, ?, ?, ?)',
                [type, entiteId, action, description, userId || null]
            );
        } catch (error) {
            console.error('Erreur logAction:', error);
            // Ne pas faire échouer la mise à jour si le log échoue
        }
    }
}

module.exports = Projet;

