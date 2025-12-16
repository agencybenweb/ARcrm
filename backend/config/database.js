/**
 * Configuration de la base de données
 * Alliance Renov CRM - Node.js
 */

// Charger les variables d'environnement
// Priorité : .env.local (développement) > .env (production)
require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // .env en fallback
const mysql = require('mysql2/promise');

// Configuration
// Les valeurs par défaut sont pour le développement local
// En production (Vercel), utilisez les variables d'environnement
const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3307,
    database: process.env.DB_NAME || 'alliance_renov',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'benjeanne8',
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Log de la configuration (sans afficher le mot de passe)
if (process.env.NODE_ENV !== 'production') {
    console.log('🔌 Configuration BDD:', {
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        source: process.env.DB_HOST ? 'Variables d\'environnement' : 'Valeurs par défaut (local)'
    });
}

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

