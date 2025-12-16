# 🚀 Configuration Vercel - Alliance Renov CRM

## ⚠️ Problèmes courants avec Vercel

Vercel utilise des **fonctions serverless**, pas un serveur Express classique. Voici comment configurer correctement :

## 📋 Étapes de configuration

### 1. Variables d'environnement sur Vercel

Dans le dashboard Vercel, allez dans **Settings > Environment Variables** et ajoutez :

```
DB_HOST=votre-host-mysql
DB_PORT=3306
DB_NAME=alliance_renov
DB_USER=votre-utilisateur
DB_PASS=votre-mot-de-passe
SESSION_SECRET=une-clé-secrète-aléatoire-très-longue
NODE_ENV=production
FRONTEND_URL=https://votre-domaine.vercel.app
```

### 2. Base de données MySQL

⚠️ **Important** : Votre base de données MySQL locale n'est **pas accessible** depuis Vercel.

**Options :**

#### Option A : Service MySQL cloud (recommandé)
- **PlanetScale** (gratuit) : https://planetscale.com
- **Railway** (gratuit) : https://railway.app
- **Aiven** : https://aiven.io
- **AWS RDS** : https://aws.amazon.com/rds

#### Option B : Tunnel SSH (développement uniquement)
Utiliser un service comme **ngrok** ou **Cloudflare Tunnel** pour exposer votre MySQL local.

### 3. Installation des dépendances

```bash
npm install memorystore
```

### 4. Déploiement

```bash
vercel --prod
```

Ou via GitHub :
1. Connecter votre repo GitHub à Vercel
2. Vercel détectera automatiquement le projet
3. Configurer les variables d'environnement
4. Déployer

## 🔧 Structure pour Vercel

```
ARcrm/
├── api/
│   └── index.js          # Point d'entrée serverless
├── backend/              # Routes et modèles (inchangés)
├── frontend/             # Fichiers statiques
├── vercel.json          # Configuration Vercel
└── package.json
```

## ⚠️ Limitations Vercel

1. **Sessions** : Utilise `memorystore` au lieu de sessions persistantes
2. **Base de données** : Doit être accessible publiquement (avec sécurité)
3. **Timeout** : 10 secondes pour les fonctions Hobby, 60s pour Pro
4. **Cold start** : Premier appel peut être lent

## 🐛 Dépannage

### Erreur "Cannot connect to database"
- Vérifier que la base de données est accessible depuis Internet
- Vérifier les variables d'environnement sur Vercel
- Vérifier le firewall MySQL

### Erreur "Session not working"
- Vérifier `SESSION_SECRET` dans les variables d'environnement
- Vérifier que `sameSite: 'none'` est configuré (nécessaire pour HTTPS)

### Erreur "CORS"
- Vérifier `FRONTEND_URL` dans les variables d'environnement
- Vérifier la configuration CORS dans `api/index.js`

## 📝 Alternative : Utiliser Railway ou Render

Si Vercel pose trop de problèmes, considérez :

- **Railway** : Supporte les serveurs Express classiques
- **Render** : Supporte les serveurs Express classiques
- **Heroku** : Supporte les serveurs Express classiques

Ces plateformes sont plus adaptées pour les applications Express avec MySQL.

