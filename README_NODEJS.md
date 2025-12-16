# 🚀 Alliance Renov CRM - Version Node.js

## Installation

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer la base de données

Éditer `backend/config/database.js` ou créer un fichier `.env` :
```env
DB_HOST=localhost
DB_NAME=alliance_renov
DB_USER=root
DB_PASS=
```

### 3. Créer la base de données MySQL

Via phpMyAdmin ou ligne de commande :
```sql
CREATE DATABASE alliance_renov CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Importer le schéma
```bash
mysql -u root -p alliance_renov < database/schema.sql
```

### 5. Démarrer le serveur
```bash
npm start
```

Ou en mode développement (avec auto-reload) :
```bash
npm run dev
```

Le serveur démarre sur : `http://localhost:3000`

## Accès

- **URL :** http://localhost:3000
- **Email :** mathieu@alliancerenov.fr
- **Mot de passe :** admin123

## Structure

- `server.js` - Point d'entrée du serveur
- `backend/config/` - Configuration (database, auth)
- `backend/models/` - Modèles de données
- `backend/routes/` - Routes API
- `frontend/` - Interface utilisateur (inchangée)

## API

L'API est disponible sur : `http://localhost:3000/api`

Mêmes endpoints que la version PHP :
- `/api/auth/login`
- `/api/clients`
- `/api/projets`
- `/api/artisans`
- `/api/devis`
- `/api/relances`
- `/api/dashboard/stats`

