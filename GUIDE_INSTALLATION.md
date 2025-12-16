# 📘 Guide d'installation pas à pas - Alliance Renov CRM

## Méthode 1 : Installation automatique (Recommandée) ⚡

### Étape 1 : Lancer l'installateur
1. Assurez-vous que votre serveur web (Apache/Nginx) et MySQL sont démarrés
2. Ouvrez votre navigateur
3. Accédez à : `http://localhost/ARcrm/install.php`
4. Suivez les instructions à l'écran

L'installateur va :
- ✅ Tester la connexion MySQL
- ✅ Créer la base de données automatiquement
- ✅ Importer le schéma SQL
- ✅ Configurer le fichier `database.php`

### Étape 2 : Accéder à l'application
Une fois l'installation terminée :
- URL : `http://localhost/ARcrm`
- Email : `mathieu@alliancerenov.fr`
- Mot de passe : `admin123`

---

## Méthode 2 : Installation manuelle 🔧

### Étape 1 : Créer la base de données

**Option A : Via phpMyAdmin**
1. Ouvrir phpMyAdmin : `http://localhost/phpmyadmin`
2. Cliquer sur "Nouvelle base de données"
3. Nom : `alliance_renov`
4. Interclassement : `utf8mb4_unicode_ci`
5. Cliquer sur "Créer"

**Option B : Via ligne de commande**
```bash
mysql -u root -p
CREATE DATABASE alliance_renov CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Étape 2 : Importer le schéma SQL

**Option A : Via phpMyAdmin**
1. Sélectionner la base `alliance_renov`
2. Cliquer sur l'onglet "Importer"
3. Choisir le fichier `database/schema.sql`
4. Cliquer sur "Exécuter"

**Option B : Via ligne de commande**
```bash
mysql -u root -p alliance_renov < database/schema.sql
```

### Étape 3 : Configurer database.php

Éditer le fichier `backend/config/database.php` :

```php
private const DB_HOST = 'localhost';      // Votre hôte MySQL
private const DB_NAME = 'alliance_renov'; // Nom de la base
private const DB_USER = 'root';           // Votre utilisateur MySQL
private const DB_PASS = '';               // Votre mot de passe MySQL
```

### Étape 4 : Tester la connexion

Ouvrir dans le navigateur : `http://localhost/ARcrm/test_connection.php`

Si tout est vert ✅, c'est bon !

### Étape 5 : Accéder à l'application

- URL : `http://localhost/ARcrm`
- Email : `mathieu@alliancerenov.fr`
- Mot de passe : `admin123`

---

## 🔍 Vérification de l'installation

### Test rapide
Ouvrir : `http://localhost/ARcrm/test_connection.php`

Ce script vérifie :
- ✅ Connexion à la base de données
- ✅ Présence de toutes les tables
- ✅ Données de test importées
- ✅ Statistiques de la base

### Vérification manuelle

**Tables attendues :**
- `utilisateurs`
- `clients`
- `projets`
- `artisans`
- `devis`
- `relances`
- `historique_actions`

**Utilisateurs par défaut :**
- `mathieu@alliancerenov.fr` (admin)
- `sophie@alliancerenov.fr` (collaborateur)
- Mot de passe : `admin123` pour les deux

---

## ❌ Résolution des problèmes

### Erreur : "Connexion à la base de données échouée"

**Solutions :**
1. Vérifier que MySQL est démarré
   - Windows : Services → MySQL
   - Linux : `sudo systemctl status mysql`
2. Vérifier les identifiants dans `backend/config/database.php`
3. Vérifier que la base de données existe :
   ```sql
   SHOW DATABASES LIKE 'alliance_renov';
   ```

### Erreur : "Table n'existe pas"

**Solution :**
Importer le fichier `database/schema.sql` :
```bash
mysql -u root -p alliance_renov < database/schema.sql
```

### Erreur : "Page blanche"

**Solutions :**
1. Activer l'affichage des erreurs PHP temporairement
2. Vérifier les logs Apache/PHP
3. Vérifier les permissions des fichiers
4. Vérifier que PHP PDO MySQL est installé :
   ```bash
   php -m | grep pdo_mysql
   ```

### Erreur : "Routes API ne fonctionnent pas"

**Solutions :**
1. **Apache** : Vérifier que `mod_rewrite` est activé
   ```bash
   # Vérifier
   apache2ctl -M | grep rewrite
   
   # Activer si nécessaire
   sudo a2enmod rewrite
   sudo systemctl restart apache2
   ```

2. **Nginx** : Vérifier la configuration (voir README.md)

3. Vérifier le fichier `.htaccess` est présent

### Erreur : "Mot de passe incorrect"

**Solution :**
Le mot de passe par défaut est `admin123`. Si cela ne fonctionne pas :
1. Vérifier que les données de test ont été importées
2. Réimporter `database/schema.sql`

---

## 🔐 Sécurité post-installation

**Important :** Après l'installation réussie :

1. **Supprimer les fichiers d'installation :**
   ```bash
   rm install.php
   rm test_connection.php
   ```

2. **Changer les mots de passe par défaut** dans l'application

3. **Configurer HTTPS** en production

4. **Désactiver l'affichage des erreurs** en production :
   Dans `backend/config/config.php` :
   ```php
   error_reporting(0);
   ini_set('display_errors', 0);
   ```

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Consulter les logs PHP/Apache
2. Vérifier `test_connection.php` pour diagnostiquer
3. Consulter le `README.md` pour plus de détails

---

## ✅ Checklist d'installation

- [ ] MySQL est démarré
- [ ] Base de données `alliance_renov` créée
- [ ] Fichier `database/schema.sql` importé
- [ ] Fichier `backend/config/database.php` configuré
- [ ] Test de connexion réussi (`test_connection.php`)
- [ ] Application accessible (`http://localhost/ARcrm`)
- [ ] Connexion réussie avec les identifiants par défaut
- [ ] Dashboard s'affiche correctement

**Une fois tous les éléments cochés, l'installation est terminée ! 🎉**

