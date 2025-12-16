/**
 * Modèle Client
 * Alliance Renov CRM - Node.js
 */

const db = require('../config/database');

class Client {
    static async getAll(filters = {}) {
        let sql = `
            SELECT c.*, 
                   u.nom as utilisateur_nom, u.prenom as utilisateur_prenom,
                   COUNT(DISTINCT p.id) as nb_projets
            FROM clients c
            LEFT JOIN utilisateurs u ON c.utilisateur_id = u.id
            LEFT JOIN projets p ON p.client_id = c.id
        `;
        
        const conditions = [];
        const params = [];

        if (filters.search) {
            conditions.push('(c.nom LIKE ? OR c.prenom LIKE ? OR c.email LIKE ? OR c.telephone LIKE ?)');
            const search = `%${filters.search}%`;
            params.push(search, search, search, search);
        }

        if (filters.statut) {
            conditions.push('c.statut = ?');
            params.push(filters.statut);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' GROUP BY c.id ORDER BY c.date_creation DESC';

        const [rows] = await db.execute(sql, params);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute(
            `SELECT c.*, 
                    u.nom as utilisateur_nom, u.prenom as utilisateur_prenom,
                    (SELECT COUNT(*) FROM projets WHERE client_id = c.id) as nb_projets
             FROM clients c
             LEFT JOIN utilisateurs u ON c.utilisateur_id = u.id
             WHERE c.id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    static async create(data) {
        const [result] = await db.execute(
            `INSERT INTO clients (
                nom, prenom, telephone, email, adresse_projet, 
                code_postal, ville, source_lead, statut, notes_internes, utilisateur_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.nom,
                data.prenom,
                data.telephone || null,
                data.email || null,
                data.adresse_projet || null,
                data.code_postal || null,
                data.ville || null,
                data.source_lead || null,
                data.statut || 'prospect',
                data.notes_internes || null,
                data.utilisateur_id || null
            ]
        );

        if (result.insertId) {
            await this.logAction('client', result.insertId, 'create', 'Client créé', data.utilisateur_id);
        }

        return result.insertId;
    }

    static async update(id, data) {
        const [result] = await db.execute(
            `UPDATE clients SET
                nom = ?, prenom = ?, telephone = ?, email = ?,
                adresse_projet = ?, code_postal = ?, ville = ?,
                source_lead = ?, statut = ?, notes_internes = ?,
                utilisateur_id = ?,
                date_modification = NOW()
            WHERE id = ?`,
            [
                data.nom,
                data.prenom,
                data.telephone || null,
                data.email || null,
                data.adresse_projet || null,
                data.code_postal || null,
                data.ville || null,
                data.source_lead || null,
                data.statut || 'prospect',
                data.notes_internes || null,
                data.utilisateur_id || null,
                id
            ]
        );

        if (result.affectedRows > 0) {
            const userId = data.utilisateur_id || null;
            await this.logAction('client', id, 'update', 'Client modifié', userId);
        }

        return result.affectedRows > 0;
    }

    // Mettre à jour le statut du client en fonction de ses projets
    static async updateStatusFromProjects(clientId) {
        try {
            const [projets] = await db.execute(
                'SELECT COUNT(*) as total, SUM(CASE WHEN statut = "termine" THEN 1 ELSE 0 END) as termines FROM projets WHERE client_id = ?',
                [clientId]
            );

            const total = parseInt(projets[0]?.total) || 0;
            const termines = parseInt(projets[0]?.termines) || 0;

            if (total > 0 && total === termines) {
                // Tous les projets sont terminés
                await db.execute(
                    'UPDATE clients SET statut = "signe", date_modification = NOW() WHERE id = ?',
                    [clientId]
                );
                return 'signe';
            } else if (total > 0 && termines < total) {
                // Il y a des projets en cours
                await db.execute(
                    'UPDATE clients SET statut = "en_cours", date_modification = NOW() WHERE id = ? AND statut = "prospect"',
                    [clientId]
                );
                return 'en_cours';
            }
            return null;
        } catch (error) {
            console.error('Erreur updateStatusFromProjects:', error);
            return null;
        }
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM clients WHERE id = ?', [id]);
        
        if (result.affectedRows > 0) {
            await this.logAction('client', id, 'delete', 'Client supprimé', null);
        }

        return result.affectedRows > 0;
    }

    static async getHistory(id) {
        const [rows] = await db.execute(
            `SELECT h.*, u.nom as utilisateur_nom, u.prenom as utilisateur_prenom
             FROM historique_actions h
             LEFT JOIN utilisateurs u ON h.utilisateur_id = u.id
             WHERE h.type_entite = 'client' AND h.entite_id = ?
             ORDER BY h.date_action DESC`,
            [id]
        );
        return rows;
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

module.exports = Client;

