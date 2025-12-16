# 📘 Guide complet - Installation et démarrage Alliance Renov CRM

## 🎯 Vue d'ensemble

Ce guide vous accompagne étape par étape pour :
1. ✅ Installer Node.js et npm
2. ✅ Créer la base de données MySQL
3. ✅ Importer le schéma SQL
4. ✅ Configurer l'application
5. ✅ Démarrer le serveur
6. ✅ Accéder à l'application

---

## ÉTAPE 1 : Vérifier Node.js et npm

### Windows

1. **Ouvrir PowerShell ou CMD**
2. **Taper les commandes suivantes :**
   ```bash
   node --version
   npm --version
   ```

3. **Si Node.js n'est pas installé :**
   - Télécharger depuis : https://nodejs.org/
   - Installer la version LTS (Long Term Support)
   - Redémarrer le terminal après installation
   - Vérifier à nouveau avec les commandes ci-dessus

### Résultat attendu
```
v18.x.x ou supérieur
9.x.x ou supérieur
```

✅ **Si vous voyez des numéros de version, passez à l'étape 2 !**

---

## ÉTAPE 2 : Installer les dépendances du projet

### 1. Ouvrir un terminal dans le dossier du projet

**Windows :**
- Ouvrir PowerShell ou CMD
- Naviguer vers le dossier :
  ```bash
  cd C:\Users\benja\OneDrive\Documents\ARcrm
  ```

### 2. Installer les dépendances

```bash
npm install
```

### Résultat attendu
Vous devriez voir :
```
added 150 packages in 30s
```

✅ **Si l'installation réussit, passez à l'étape 3 !**

---

## ÉTAPE 3 : Créer la base de données MySQL

### Option A : Via phpMyAdmin (Recommandé)

1. **Ouvrir phpMyAdmin**
   - Si vous utilisez XAMPP/WAMP : `http://localhost/phpmyadmin`
   - Si vous utilisez DevServer : Chercher l'icône phpMyAdmin dans DevServer

2. **Créer la base de données**
   - Cliquer sur "Nouvelle base de données" (ou "New" en anglais)
   - **Nom de la base :** `alliance_renov`
   - **Interclassement :** `utf8mb4_unicode_ci`
   - Cliquer sur "Créer" (ou "Create")

3. **Vérification**
   - Vous devriez voir `alliance_renov` dans la liste des bases de données à gauche

✅ **Base de données créée ! Passez à l'étape 4.**

### Option B : Via ligne de commande MySQL

1. **Ouvrir un terminal**
2. **Se connecter à MySQL :**
   ```bash
   mysql -u root -p
   ```
   (Entrer votre mot de passe MySQL, ou appuyer sur Entrée si pas de mot de passe)

3. **Créer la base de données :**
   ```sql
   CREATE DATABASE alliance_renov CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. **Vérifier :**
   ```sql
   SHOW DATABASES;
   ```
   (Vous devriez voir `alliance_renov` dans la liste)

5. **Quitter MySQL :**
   ```sql
   EXIT;
   ```

✅ **Base de données créée ! Passez à l'étape 4.**

---

## ÉTAPE 4 : Importer le schéma SQL

### Option A : Via phpMyAdmin (Recommandé)

1. **Sélectionner la base de données**
   - Dans phpMyAdmin, cliquer sur `alliance_renov` dans la liste de gauche

2. **Importer le fichier**
   - Cliquer sur l'onglet "Importer" (ou "Import")
   - Cliquer sur "Choisir un fichier" (ou "Choose File")
   - Naviguer vers : `C:\Users\benja\OneDrive\Documents\ARcrm\database\schema.sql`
   - Sélectionner le fichier `schema.sql`
   - Cliquer sur "Exécuter" (ou "Go") en bas de la page

3. **Vérification**
   - Vous devriez voir un message de succès
   - Dans l'onglet "Structure", vous devriez voir 7 tables :
     - `utilisateurs`
     - `clients`
     - `projets`
     - `artisans`
     - `devis`
     - `relances`
     - `historique_actions`

✅ **Schéma importé ! Passez à l'étape 5.**

### Option B : Via ligne de commande

1. **Ouvrir un terminal**
2. **Importer le schéma :**
   ```bash
   mysql -u root -p alliance_renov < database/schema.sql
   ```
   (Entrer votre mot de passe MySQL si demandé)

3. **Vérifier :**
   ```bash
   mysql -u root -p alliance_renov -e "SHOW TABLES;"
   ```
   (Vous devriez voir les 7 tables listées)

✅ **Schéma importé ! Passez à l'étape 5.**

---

## ÉTAPE 5 : Configurer la connexion à la base de données

### Option A : Modifier directement le fichier (Simple)

1. **Ouvrir le fichier :** `backend/config/database.js`

2. **Vérifier/modifier ces lignes :**
   ```javascript
   host: process.env.DB_HOST || 'localhost',
   database: process.env.DB_NAME || 'alliance_renov',
   user: process.env.DB_USER || 'root',
   password: process.env.DB_PASS || '',
   ```

3. **Si vos identifiants MySQL sont différents :**
   - Modifier `'root'` par votre utilisateur MySQL
   - Modifier `''` par votre mot de passe MySQL

✅ **Configuration terminée ! Passez à l'étape 6.**

### Option B : Utiliser un fichier .env (Recommandé pour production)

1. **Créer un fichier `.env` à la racine du projet**
   (Même niveau que `package.json`)

2. **Ajouter ces lignes :**
   ```env
   DB_HOST=localhost
   DB_NAME=alliance_renov
   DB_USER=root
   DB_PASS=
   PORT=3000
   ```

3. **Modifier les valeurs si nécessaire**

✅ **Configuration terminée ! Passez à l'étape 6.**

---

## ÉTAPE 6 : Démarrer le serveur

### 1. Ouvrir un terminal dans le dossier du projet

**Windows :**
```bash
cd C:\Users\benja\OneDrive\Documents\ARcrm
```

### 2. Démarrer le serveur

```bash
npm start
```

### Résultat attendu

Vous devriez voir :
```
✅ Connexion à la base de données réussie
🚀 Serveur Alliance Renov CRM démarré sur http://localhost:3000
📊 API disponible sur http://localhost:3000/api
```

✅ **Si vous voyez ces messages, le serveur est démarré !**

⚠️ **Important :** Gardez cette fenêtre de terminal ouverte. Si vous la fermez, le serveur s'arrêtera.

---

## ÉTAPE 7 : Accéder à l'application

### 1. Ouvrir votre navigateur

Chrome, Firefox, Edge, etc.

### 2. Aller à l'adresse

```
http://localhost:3000
```

### 3. Vous devriez voir

- La page de connexion d'Alliance Renov CRM
- Un formulaire avec "Email" et "Mot de passe"

✅ **Si vous voyez la page de connexion, c'est bon !**

---

## ÉTAPE 8 : Se connecter

### Identifiants par défaut

**Administrateur :**
- **Email :** `mathieu@alliancerenov.fr`
- **Mot de passe :** `admin123`

**Collaborateur :**
- **Email :** `sophie@alliancerenov.fr`
- **Mot de passe :** `admin123`

### 1. Entrer l'email et le mot de passe
### 2. Cliquer sur "Se connecter"

### Résultat attendu

- Vous êtes redirigé vers le Dashboard
- Vous voyez les statistiques (nombre de clients, projets, etc.)
- Le menu latéral est visible avec toutes les sections

✅ **Si vous voyez le Dashboard, l'installation est terminée ! 🎉**

---

## 🎯 Résumé des étapes

1. ✅ Node.js et npm installés
2. ✅ `npm install` exécuté
3. ✅ Base de données `alliance_renov` créée
4. ✅ Fichier `schema.sql` importé
5. ✅ Configuration BDD vérifiée
6. ✅ `npm start` exécuté
7. ✅ Application accessible sur `http://localhost:3000`
8. ✅ Connexion réussie avec les identifiants par défaut

---

## ❓ Problèmes courants

### Erreur : "Cannot find module"

**Solution :**
```bash
npm install
```

### Erreur : "Connexion à la base de données échouée"

**Vérifications :**
1. MySQL est-il démarré ? (XAMPP/WAMP/DevServer)
2. Les identifiants dans `backend/config/database.js` sont-ils corrects ?
3. La base de données `alliance_renov` existe-t-elle ?

### Erreur : "Port 3000 already in use"

**Solution :**
- Changer le port dans `server.js` ou `.env` :
  ```javascript
  const PORT = process.env.PORT || 3001;
  ```
- Ou arrêter l'autre application qui utilise le port 3000

### Page blanche dans le navigateur

**Vérifications :**
1. Le serveur est-il démarré ? (Vérifier le terminal)
2. L'URL est-elle correcte ? (`http://localhost:3000`)
3. Y a-t-il des erreurs dans la console du navigateur ? (F12)

### "Identifiants incorrects"

**Vérifications :**
1. Les données de test ont-elles été importées ? (Étape 4)
2. Utiliser exactement : `mathieu@alliancerenov.fr` / `admin123`

---

## 🚀 Commandes utiles

### Démarrer le serveur
```bash
npm start
```

### Démarrer en mode développement (avec auto-reload)
```bash
npm run dev
```
(Requiert nodemon installé : `npm install -g nodemon`)

### Arrêter le serveur
Dans le terminal, appuyer sur : `Ctrl + C`

### Vérifier que Node.js fonctionne
```bash
node --version
npm --version
```

---

## 📞 Besoin d'aide ?

Si vous êtes bloqué à une étape :
1. Relire attentivement l'étape concernée
2. Vérifier les messages d'erreur dans le terminal
3. Vérifier les logs dans la console du navigateur (F12)

---

**Félicitations ! Votre CRM Alliance Renov est maintenant opérationnel ! 🎉**

