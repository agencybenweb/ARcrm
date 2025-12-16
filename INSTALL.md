# Guide d'installation rapide - Alliance Renov CRM

## Installation en 5 étapes

### 1. Base de données
```sql
CREATE DATABASE alliance_renov;
```
Puis importer `database/schema.sql` via phpMyAdmin ou :
```bash
mysql -u root -p alliance_renov < database/schema.sql
```

### 2. Configuration
Éditer `backend/config/database.php` :
```php
private const DB_HOST = 'localhost';
private const DB_NAME = 'alliance_renov';
private const DB_USER = 'root';        // Votre utilisateur MySQL
private const DB_PASS = '';            // Votre mot de passe MySQL
```

### 3. Serveur web
**Apache** : Le fichier `.htaccess` est déjà configuré. Assurez-vous que `mod_rewrite` est activé.

**Nginx** : Voir la configuration dans `README.md`

### 4. Accès
Ouvrir dans le navigateur : `http://localhost/ARcrm`

### 5. Connexion
- **Email** : `mathieu@alliancerenov.fr`
- **Mot de passe** : `admin123`

## Vérification

Si vous voyez la page de connexion, tout fonctionne ! 🎉

## Problèmes courants

### Erreur de connexion à la base de données
- Vérifier les identifiants dans `backend/config/database.php`
- Vérifier que MySQL est démarré
- Vérifier que la base de données existe

### Page blanche
- Activer l'affichage des erreurs PHP temporairement
- Vérifier les logs Apache/PHP
- Vérifier les permissions des fichiers

### Routes API ne fonctionnent pas
- Vérifier que `mod_rewrite` est activé (Apache)
- Vérifier la configuration Nginx si utilisé
- Vérifier le fichier `.htaccess`

## Support

Consulter le `README.md` pour plus de détails.

