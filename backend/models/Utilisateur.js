/**
 * Modèle Utilisateur
 * Alliance Renov CRM - Node.js
 */

const db = require('../config/database');
const bcrypt = require('bcrypt');

class Utilisateur {
    static async authenticate(email, password) {
        const [rows] = await db.execute(
            'SELECT id, nom, prenom, email, password, role FROM utilisateurs WHERE email = ? AND actif = 1',
            [email]
        );

        if (rows.length === 0) {
            return false;
        }

        const user = rows[0];
        const isValid = await bcrypt.compare(password, user.password);

        if (isValid) {
            delete user.password;
            return user;
        }

        return false;
    }

    static async getById(id) {
        const [rows] = await db.execute(
            'SELECT id, nom, prenom, email, role, actif, date_creation FROM utilisateurs WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    }

    static async getAll() {
        const [rows] = await db.execute(
            'SELECT id, nom, prenom, email, role, actif, date_creation FROM utilisateurs ORDER BY nom, prenom'
        );
        return rows;
    }

    static async create(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const [result] = await db.execute(
            'INSERT INTO utilisateurs (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [data.nom, data.prenom, data.email, hashedPassword, data.role || 'collaborateur']
        );
        return result.insertId;
    }

    static async update(id, data) {
        const updates = [];
        const values = [];

        if (data.nom) {
            updates.push('nom = ?');
            values.push(data.nom);
        }
        if (data.prenom) {
            updates.push('prenom = ?');
            values.push(data.prenom);
        }
        if (data.email) {
            updates.push('email = ?');
            values.push(data.email);
        }
        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            updates.push('password = ?');
            values.push(hashedPassword);
        }
        if (data.role) {
            updates.push('role = ?');
            values.push(data.role);
        }
        if (data.actif !== undefined) {
            updates.push('actif = ?');
            values.push(data.actif);
        }

        if (updates.length === 0) {
            return false;
        }

        values.push(id);
        const sql = `UPDATE utilisateurs SET ${updates.join(', ')} WHERE id = ?`;
        const [result] = await db.execute(sql, values);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute('UPDATE utilisateurs SET actif = 0 WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Utilisateur;

