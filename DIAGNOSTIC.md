# 🔍 Diagnostic - Problème d'accès à install.php

## Vérifications à faire

### 1. Vérifier que le serveur web est démarré

**Windows avec XAMPP/WAMP :**
- Ouvrir le panneau de contrôle XAMPP/WAMP
- Vérifier que **Apache** est démarré (bouton vert)
- Si non, cliquer sur "Start" pour Apache

**Windows avec serveur intégré :**
- Ouvrir PowerShell en tant qu'administrateur
- Naviguer vers le dossier : `cd C:\Users\benja\OneDrive\Documents\ARcrm`
- Lancer : `php -S localhost:8000`
- Accéder à : `http://localhost:8000/install.php`

**Linux :**
```bash
sudo systemctl status apache2
# ou
sudo systemctl status nginx
```

### 2. Tester PHP directement

Ouvrir dans le navigateur : `http://localhost/ARcrm/test.php`

Si vous voyez les informations PHP, PHP fonctionne ✅
Si page blanche ou erreur, PHP n'est pas configuré ❌

### 3. Vérifier le chemin

Le chemin devrait être :
- `http://localhost/ARcrm/install.php`

Si vous utilisez un autre port ou un autre chemin :
- `http://localhost:8080/ARcrm/install.php` (si port 8080)
- `http://127.0.0.1/ARcrm/install.php` (alternative)

### 4. Vérifier les permissions

**Windows :** Normalement pas de problème de permissions

**Linux :** Vérifier que les fichiers sont lisibles :
```bash
chmod 644 install.php
chmod 755 .
```

### 5. Vérifier les logs d'erreur

**Apache :**
- Windows : `C:\xampp\apache\logs\error.log`
- Linux : `/var/log/apache2/error.log`

**PHP :**
- Vérifier `php.ini` : `display_errors = On`
- Vérifier les logs PHP

### 6. Solution alternative : Serveur PHP intégré

Si Apache ne fonctionne pas, utiliser le serveur PHP intégré :

1. **Ouvrir PowerShell ou CMD**
2. **Naviguer vers le dossier :**
   ```bash
   cd C:\Users\benja\OneDrive\Documents\ARcrm
   ```
3. **Lancer le serveur :**
   ```bash
   php -S localhost:8000
   ```
4. **Ouvrir dans le navigateur :**
   ```
   http://localhost:8000/install.php
   ```

### 7. Vérifier que le fichier existe

Dans PowerShell :
```powershell
Test-Path install.php
```
Doit retourner `True`

### 8. Test avec un fichier HTML simple

Créer `test.html` :
```html
<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body><h1>Test réussi !</h1></body>
</html>
```

Ouvrir : `http://localhost/ARcrm/test.html`

Si ça fonctionne, le problème est avec PHP.
Si ça ne fonctionne pas, le problème est avec le serveur web.

---

## Solutions rapides

### Solution 1 : Utiliser le serveur PHP intégré
```bash
cd C:\Users\benja\OneDrive\Documents\ARcrm
php -S localhost:8000
```
Puis ouvrir : `http://localhost:8000/install.php`

### Solution 2 : Vérifier la configuration Apache
- Vérifier que `mod_rewrite` est activé
- Vérifier que PHP est activé dans Apache
- Redémarrer Apache

### Solution 3 : Installation manuelle
Si `install.php` ne fonctionne pas, faire l'installation manuellement :
1. Créer la base via phpMyAdmin
2. Importer `database/schema.sql`
3. Configurer `backend/config/database.php`
4. Utiliser `test_connection.php` pour vérifier

---

## Messages d'erreur courants

### "404 Not Found"
- Le fichier n'existe pas à cet emplacement
- Vérifier le chemin dans l'URL
- Vérifier que vous êtes dans le bon dossier

### "403 Forbidden"
- Problème de permissions
- Vérifier `.htaccess`

### Page blanche
- Erreur PHP (vérifier les logs)
- PHP n'est pas configuré
- Activer `display_errors` dans `php.ini`

### "This site can't be reached"
- Le serveur web n'est pas démarré
- Vérifier Apache/XAMPP/WAMP

---

## Test rapide

1. Ouvrir : `http://localhost/ARcrm/test.php`
2. Si ça fonctionne → PHP OK ✅
3. Si ça ne fonctionne pas → Problème serveur/PHP ❌

Ensuite essayer : `http://localhost/ARcrm/install.php`

