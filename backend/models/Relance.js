/**
 * Modèle Relance
 * Alliance Renov CRM - Node.js
 */

const db = require('../config/database');

class Relance {
    static async getAll(filters = {}) {
        let sql = `
            SELECT r.*, 
                   c.nom as client_nom, c.prenom as client_prenom,
                   p.titre as projet_titre,
                   d.numero as devis_numero,
                   u.nom as utilisateur_nom, u.prenom as utilisateur_prenom
            FROM relances r
            LEFT JOIN clients c ON r.client_id = c.id
            LEFT JOIN projets p ON r.projet_id = p.id
            LEFT JOIN devis d ON r.devis_id = d.id
            LEFT JOIN utilisateurs u ON r.utilisateur_id = u.id
        `;

        const conditions = [];
        const params = [];

        if (filters.client_id) {
            conditions.push('r.client_id = ?');
            params.push(filters.client_id);
        }

        if (filters.projet_id) {
            conditions.push('r.projet_id = ?');
            params.push(filters.projet_id);
        }

        if (filters.devis_id) {
            conditions.push('r.devis_id = ?');
            params.push(filters.devis_id);
        }

        if (filters.statut) {
            conditions.push('r.statut = ?');
            params.push(filters.statut);
        }

        if (filters.type) {
            conditions.push('r.type = ?');
            params.push(filters.type);
        }

        if (filters.date_from) {
            conditions.push('r.date_programmee >= ?');
            params.push(filters.date_from);
        }

        if (filters.date_to) {
            conditions.push('r.date_programmee <= ?');
            params.push(filters.date_to);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY r.date_programmee ASC';

        const [rows] = await db.execute(sql, params);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute(
            `SELECT r.*, 
                    c.nom as client_nom, c.prenom as client_prenom,
                    p.titre as projet_titre,
                    d.numero as devis_numero,
                    u.nom as utilisateur_nom, u.prenom as utilisateur_prenom
             FROM relances r
             LEFT JOIN clients c ON r.client_id = c.id
             LEFT JOIN projets p ON r.projet_id = p.id
             LEFT JOIN devis d ON r.devis_id = d.id
             LEFT JOIN utilisateurs u ON r.utilisateur_id = u.id
             WHERE r.id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    static async create(data) {
        const [result] = await db.execute(
            `INSERT INTO relances (
                type, client_id, projet_id, devis_id, titre,
                description, date_programmee, statut, utilisateur_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.type,
                data.client_id || null,
                data.projet_id || null,
                data.devis_id || null,
                data.titre,
                data.description || null,
                data.date_programmee,
                data.statut || 'a_faire',
                data.utilisateur_id || null
            ]
        );

        if (result.insertId) {
            await this.logAction('relance', result.insertId, 'create', 'Relance créée', data.utilisateur_id);
        }

        return result.insertId;
    }

    static async update(id, data) {
        const [result] = await db.execute(
            `UPDATE relances SET
                type = ?, client_id = ?, projet_id = ?, devis_id = ?,
                titre = ?, description = ?, date_programmee = ?, statut = ?,
                date_modification = NOW()
            WHERE id = ?`,
            [
                data.type,
                data.client_id || null,
                data.projet_id || null,
                data.devis_id || null,
                data.titre,
                data.description || null,
                data.date_programmee,
                data.statut || 'a_faire',
                id
            ]
        );

        if (result.affectedRows > 0) {
            const userId = data.utilisateur_id || null;
            await this.logAction('relance', id, 'update', 'Relance modifiée', userId);
        }

        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM relances WHERE id = ?', [id]);

        if (result.affectedRows > 0) {
            await this.logAction('relance', id, 'delete', 'Relance supprimée', null);
        }

        return result.affectedRows > 0;
    }

    static async getUpcoming(limit = 10) {
        try {
            const limitNum = parseInt(limit, 10);
            const [rows] = await db.execute(
                `SELECT r.*, 
                        c.nom as client_nom, c.prenom as client_prenom,
                        p.titre as projet_titre
                 FROM relances r
                 LEFT JOIN clients c ON r.client_id = c.id
                 LEFT JOIN projets p ON r.projet_id = p.id
                 WHERE r.statut = 'a_faire' 
                 AND DATE(r.date_programmee) >= CURDATE()
                 ORDER BY r.date_programmee ASC, r.id ASC
                 LIMIT ?`,
                [limitNum]
            );
            console.log(`getUpcoming: ${rows.length} relances trouvées`);
            return rows || [];
        } catch (error) {
            console.error('Erreur getUpcoming relances:', error);
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

module.exports = Relance;

