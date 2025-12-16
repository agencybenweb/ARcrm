/**
 * Modèle Devis
 * Alliance Renov CRM - Node.js
 */

const db = require('../config/database');

class Devis {
    static async getAll(filters = {}) {
        let sql = `
            SELECT d.*, 
                   p.titre as projet_titre, p.client_id,
                   c.nom as client_nom, c.prenom as client_prenom,
                   a.nom_societe as artisan_nom, a.metier as artisan_metier,
                   u.nom as utilisateur_nom, u.prenom as utilisateur_prenom
            FROM devis d
            LEFT JOIN projets p ON d.projet_id = p.id
            LEFT JOIN clients c ON p.client_id = c.id
            LEFT JOIN artisans a ON d.artisan_id = a.id
            LEFT JOIN utilisateurs u ON d.utilisateur_id = u.id
        `;

        const conditions = [];
        const params = [];

        if (filters.projet_id) {
            conditions.push('d.projet_id = ?');
            params.push(filters.projet_id);
        }

        if (filters.artisan_id) {
            conditions.push('d.artisan_id = ?');
            params.push(filters.artisan_id);
        }

        if (filters.statut) {
            conditions.push('d.statut = ?');
            params.push(filters.statut);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY d.date_devis DESC, d.date_creation DESC';

        const [rows] = await db.execute(sql, params);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute(
            `SELECT d.*, 
                    p.titre as projet_titre, p.client_id,
                    c.nom as client_nom, c.prenom as client_prenom,
                    a.nom_societe as artisan_nom, a.metier as artisan_metier,
                    u.nom as utilisateur_nom, u.prenom as utilisateur_prenom
             FROM devis d
             LEFT JOIN projets p ON d.projet_id = p.id
             LEFT JOIN clients c ON p.client_id = c.id
             LEFT JOIN artisans a ON d.artisan_id = a.id
             LEFT JOIN utilisateurs u ON d.utilisateur_id = u.id
             WHERE d.id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    static async create(data) {
        let numero = data.numero;
        if (!numero) {
            numero = await this.generateNumero();
        }

        const [result] = await db.execute(
            `INSERT INTO devis (
                projet_id, artisan_id, numero, montant, commission,
                statut, date_devis, date_limite, notes, utilisateur_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.projet_id,
                data.artisan_id,
                numero,
                data.montant,
                data.commission || null,
                data.statut || 'envoye',
                data.date_devis,
                data.date_limite || null,
                data.notes || null,
                data.utilisateur_id || null
            ]
        );

        if (result.insertId) {
            await this.logAction('devis', result.insertId, 'create', 'Devis créé', data.utilisateur_id);
        }

        return result.insertId;
    }

    static async update(id, data) {
        const [result] = await db.execute(
            `UPDATE devis SET
                projet_id = ?, artisan_id = ?, numero = ?, montant = ?, commission = ?,
                statut = ?, date_devis = ?, date_limite = ?, notes = ?,
                utilisateur_id = ?,
                date_modification = NOW()
            WHERE id = ?`,
            [
                data.projet_id,
                data.artisan_id,
                data.numero || null,
                data.montant,
                data.commission || null,
                data.statut || 'envoye',
                data.date_devis,
                data.date_limite || null,
                data.notes || null,
                data.utilisateur_id || null,
                id
            ]
        );

        if (result.affectedRows > 0) {
            const userId = data.utilisateur_id || null;
            await this.logAction('devis', id, 'update', 'Devis modifié', userId);
        }

        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM devis WHERE id = ?', [id]);

        if (result.affectedRows > 0) {
            await this.logAction('devis', id, 'delete', 'Devis supprimé', null);
        }

        return result.affectedRows > 0;
    }

    static async generateNumero() {
        const year = new Date().getFullYear();
        const [rows] = await db.execute(
            'SELECT COUNT(*) as count FROM devis WHERE YEAR(date_creation) = ?',
            [year]
        );
        const num = String(rows[0].count + 1).padStart(4, '0');
        return `DEV-${year}-${num}`;
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

module.exports = Devis;

