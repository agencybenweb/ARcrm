# Alliance Renov - CRM

CRM complet pour entreprise de courtage en travaux.

## 📋 Caractéristiques

- **Gestion des clients** : CRUD complet avec recherche et filtres
- **Gestion des projets** : Suivi des chantiers et travaux
- **Gestion des artisans** : Base de données des partenaires
- **Gestion des devis** : Suivi des devis et commissions
- **Relances** : Planning et suivi des relances
- **Dashboard** : Vue d'ensemble avec statistiques
- **Export CSV** : Export des clients et devis
- **Authentification** : Système de connexion avec rôles

## 🚀 Installation

### Prérequis

- **Node.js** 16+ et npm
- **MySQL** 5.7+ ou MariaDB
- Extension MySQL activée

### Étapes d'installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Créer la base de données**
   - Créer une base de données MySQL nommée `alliance_renov`
   - Importer le fichier `database/schema.sql` via phpMyAdmin ou en ligne de commande :
   ```bash
   mysql -u root -p alliance_renov < database/schema.sql
   ```

3. **Configurer la connexion à la base de données**
   - Éditer le fichier `backend/config/database.js`
   - Modifier les valeurs si nécessaire :
   ```javascript
   host: process.env.DB_HOST || 'localhost',
   database: process.env.DB_NAME || 'alliance_renov',
   user: process.env.DB_USER || 'root',
   password: process.env.DB_PASS || '',
   ```

   Ou créer un fichier `.env` :
   ```env
   DB_HOST=localhost
   DB_NAME=alliance_renov
   DB_USER=root
   DB_PASS=
   PORT=3000
   ```

4. **Démarrer le serveur**
   ```bash
   npm start
   ```

   Ou en mode développement (avec auto-reload) :
   ```bash
   npm run dev
   ```

5. **Accéder à l'application**
   - Ouvrir un navigateur et aller à `http://localhost:3000`
   - Se connecter avec les identifiants par défaut :
     - **Email** : `mathieu@alliancerenov.fr`
     - **Mot de passe** : `admin123`

## 👤 Comptes par défaut

### Administrateur
- Email : `mathieu@alliancerenov.fr`
- Mot de passe : `admin123`
- Rôle : Admin

### Collaborateur
- Email : `sophie@alliancerenov.fr`
- Mot de passe : `admin123`
- Rôle : Collaborateur

## 📁 Structure du projet

```
ARcrm/
├── backend/
│   ├── config/
│   │   ├── database.js        # Configuration BDD
│   │   └── auth.js            # Gestion authentification
│   ├── models/                # Modèles de données
│   │   ├── Utilisateur.js
│   │   ├── Client.js
│   │   ├── Projet.js
│   │   ├── Artisan.js
│   │   ├── Devis.js
│   │   ├── Relance.js
│   │   └── Dashboard.js
│   └── routes/                # Routes API
│       ├── index.js
│       ├── auth.js
│       ├── clients.js
│       ├── projets.js
│       ├── artisans.js
│       ├── devis.js
│       ├── relances.js
│       └── dashboard.js
├── frontend/
│   ├── index.html             # Interface principale
│   └── assets/
│       ├── css/
│       │   └── style.css
│       └── js/
│           ├── api.js        # Client API
│           └── app.js        # Application principale
├── database/
│   └── schema.sql            # Script SQL complet
├── server.js                  # Point d'entrée Node.js
├── package.json              # Dépendances npm
└── README.md                 # Ce fichier
```

## 🔌 API REST

L'API est accessible via `/api/` :

- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/check` - Vérifier la session

- `GET /api/clients` - Liste des clients
- `GET /api/clients/:id` - Détails d'un client
- `POST /api/clients` - Créer un client
- `PUT /api/clients/:id` - Modifier un client
- `DELETE /api/clients/:id` - Supprimer un client
- `GET /api/clients/export` - Export CSV

- `GET /api/projets` - Liste des projets
- `GET /api/projets/:id` - Détails d'un projet
- `POST /api/projets` - Créer un projet
- `PUT /api/projets/:id` - Modifier un projet
- `DELETE /api/projets/:id` - Supprimer un projet

- `GET /api/artisans` - Liste des artisans
- `GET /api/artisans/:id` - Détails d'un artisan
- `POST /api/artisans` - Créer un artisan
- `PUT /api/artisans/:id` - Modifier un artisan
- `DELETE /api/artisans/:id` - Supprimer un artisan

- `GET /api/devis` - Liste des devis
- `GET /api/devis/:id` - Détails d'un devis
- `POST /api/devis` - Créer un devis
- `PUT /api/devis/:id` - Modifier un devis
- `DELETE /api/devis/:id` - Supprimer un devis
- `GET /api/devis/export` - Export CSV

- `GET /api/relances` - Liste des relances
- `GET /api/relances/:id` - Détails d'une relance
- `POST /api/relances` - Créer une relance
- `PUT /api/relances/:id` - Modifier une relance
- `DELETE /api/relances/:id` - Supprimer une relance
- `GET /api/relances/upcoming` - Relances à venir

- `GET /api/dashboard/stats` - Statistiques du dashboard

## 🔒 Sécurité

- Sessions sécurisées avec timeout (30 minutes)
- Requêtes préparées (protection SQL injection)
- Validation des données côté serveur
- Hashage des mots de passe (bcrypt)
- CORS configuré

## 📦 Technologies utilisées

- **Backend** : Node.js + Express
- **Base de données** : MySQL
- **Frontend** : HTML/CSS/JavaScript vanilla
- **Sessions** : express-session
- **Authentification** : bcrypt

## 🛠️ Développement

### Modifier la configuration

- Base de données : `backend/config/database.js`
- Port du serveur : Variable d'environnement `PORT` ou `server.js`

### Ajouter une fonctionnalité

1. Créer le modèle dans `backend/models/`
2. Créer les routes dans `backend/routes/`
3. Ajouter l'interface dans `frontend/`

## 📝 Notes

- Les données de test sont incluses dans `schema.sql`
- Le mot de passe par défaut est `admin123` (hashé avec bcrypt)
- L'application est prête pour la production après configuration appropriée
- Compatible avec phpMyAdmin pour la gestion de la base de données

## 📄 Licence

Propriétaire - Alliance Renov

## 👨‍💻 Support

Pour toute question ou problème, contacter le développeur.

---

**Alliance Renov** - 31 rue du Bistanclaque, 38110 Cessieu
Représentant : Mathieu Dubois
