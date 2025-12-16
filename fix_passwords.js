/**
 * Script pour régénérer les mots de passe avec bcrypt Node.js
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function fixPasswords() {
    try {
        // Connexion à la base de données
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3307,
            user: 'root',
            password: 'benjeanne8',
            database: 'alliance_renov'
        });

        console.log('✅ Connexion à la base de données réussie');

        // Générer le nouveau hash pour "admin123"
        const password = 'admin123';
        const hash = await bcrypt.hash(password, 10);
        console.log('Nouveau hash généré:', hash);

        // Mettre à jour les mots de passe
        await connection.execute(
            'UPDATE utilisateurs SET password = ? WHERE email = ?',
            [hash, 'mathieu@alliancerenov.fr']
        );

        await connection.execute(
            'UPDATE utilisateurs SET password = ? WHERE email = ?',
            [hash, 'sophie@alliancerenov.fr']
        );

        console.log('✅ Mots de passe mis à jour avec succès !');
        console.log('Email: mathieu@alliancerenov.fr');
        console.log('Mot de passe: admin123');

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

fixPasswords();

