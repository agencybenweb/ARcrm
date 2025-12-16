/**
 * Configuration de la base de données
 * Alliance Renov CRM - Node.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

// Configuration
const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    database: process.env.DB_NAME || 'alliance_renov',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'benjeanne8',
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Pool de connexions
const pool = mysql.createPool(config);

// Test de connexion
pool.getConnection()
    .then(connection => {
        console.log('✅ Connexion à la base de données réussie');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Erreur de connexion à la base de données:', err.message);
    });

module.exports = pool;

