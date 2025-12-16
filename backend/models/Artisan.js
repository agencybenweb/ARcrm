/**
 * Modèle Artisan
 * Alliance Renov CRM - Node.js
 */

const db = require('../config/database');

class Artisan {
    static async getAll(filters = {}) {
        let sql = `
            SELECT a.*, COUNT(DISTINCT d.id) as nb_devis
            FROM artisans a
            LEFT JOIN devis d ON d.artisan_id = a.id
        `;

        const conditions = [];
        const params = [];

        if (filters.metier) {
            conditions.push('a.metier = ?');
            params.push(filters.metier);
        }

        if (filters.actif !== undefined) {
            conditions.push('a.actif = ?');
            params.push(filters.actif);
        }

        if (filters.search) {
            conditions.push('(a.nom_societe LIKE ? OR a.metier LIKE ? OR a.email LIKE ? OR a.telephone LIKE ?)');
            const search = `%${filters.search}%`;
            params.push(search, search, search, search);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' GROUP BY a.id ORDER BY a.nom_societe';

        const [rows] = await db.execute(sql, params);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute('SELECT * FROM artisans WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async create(data) {
        const [result] = await db.execute(
            `INSERT INTO artisans (
                nom_societe, metier, telephone, email, 
                zone_intervention, adresse, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.nom_societe,
                data.metier,
                data.telephone || null,
                data.email || null,
                data.zone_intervention || null,
                data.adresse || null,
                data.notes || null
            ]
        );

        if (result.insertId) {
            await this.logAction('artisan', result.insertId, 'create', 'Artisan créé', null);
        }

        return result.insertId;
    }

    static async update(id, data) {
        const [result] = await db.execute(
            `UPDATE artisans SET
                nom_societe = ?, metier = ?, telephone = ?, email = ?,
                zone_intervention = ?, adresse = ?, notes = ?,
                actif = ?, date_modification = NOW()
            WHERE id = ?`,
            [
                data.nom_societe,
                data.metier,
                data.telephone || null,
                data.email || null,
                data.zone_intervention || null,
                data.adresse || null,
                data.notes || null,
                data.actif !== undefined ? data.actif : 1,
                id
            ]
        );

        if (result.affectedRows > 0) {
            await this.logAction('artisan', id, 'update', 'Artisan modifié', null);
        }

        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute('UPDATE artisans SET actif = 0 WHERE id = ?', [id]);

        if (result.affectedRows > 0) {
            await this.logAction('artisan', id, 'delete', 'Artisan supprimé', null);
        }

        return result.affectedRows > 0;
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

module.exports = Artisan;

