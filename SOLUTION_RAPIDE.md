# ⚡ Solution rapide - install.php ne s'ouvre pas

## Problème
Quand vous ouvrez `http://localhost/ARcrm/install.php`, rien ne s'affiche.

## Solutions (essayer dans l'ordre)

### ✅ Solution 1 : Utiliser le serveur PHP intégré (LE PLUS SIMPLE)

1. **Double-cliquer sur :** `start_server.bat`
   - Le serveur va démarrer automatiquement

2. **Ouvrir dans le navigateur :**
   ```
   http://localhost:8000/install.php
   ```

3. **C'est tout !** 🎉

---

### ✅ Solution 2 : Vérifier que le serveur web est démarré

**Si vous utilisez XAMPP :**
1. Ouvrir le panneau de contrôle XAMPP
2. Vérifier que **Apache** est démarré (bouton vert)
3. Si non, cliquer sur "Start"
4. Réessayer : `http://localhost/ARcrm/install.php`

**Si vous utilisez WAMP :**
1. Vérifier que l'icône WAMP est **vert**
2. Si orange ou rouge, cliquer dessus et démarrer les services
3. Réessayer : `http://localhost/ARcrm/install.php`

---

### ✅ Solution 3 : Tester PHP d'abord

1. **Ouvrir :** `http://localhost/ARcrm/test.php`

2. **Si ça fonctionne :**
   - PHP fonctionne ✅
   - Le problème vient peut-être du `.htaccess`
   - Essayer : `http://localhost/ARcrm/install.php`

3. **Si ça ne fonctionne pas :**
   - Le serveur web n'est pas démarré
   - Utiliser la Solution 1 (serveur PHP intégré)

---

### ✅ Solution 4 : Installation manuelle (si install.php ne fonctionne toujours pas)

Si `install.php` ne fonctionne pas, faire l'installation manuellement :

#### Étape 1 : Créer la base de données
1. Ouvrir phpMyAdmin : `http://localhost/phpmyadmin`
2. Cliquer sur "Nouvelle base de données"
3. Nom : `alliance_renov`
4. Interclassement : `utf8mb4_unicode_ci`
5. Cliquer sur "Créer"

#### Étape 2 : Importer le schéma
1. Sélectionner la base `alliance_renov`
2. Onglet "Importer"
3. Choisir le fichier `database/schema.sql`
4. Cliquer sur "Exécuter"

#### Étape 3 : Configurer database.php
Éditer `backend/config/database.php` :
```php
private const DB_HOST = 'localhost';
private const DB_NAME = 'alliance_renov';
private const DB_USER = 'root';        // Votre utilisateur
private const DB_PASS = '';            // Votre mot de passe
```

#### Étape 4 : Tester
Ouvrir : `http://localhost/ARcrm/test_connection.php`

#### Étape 5 : Utiliser
Ouvrir : `http://localhost/ARcrm`

---

## 🎯 Recommandation

**Utilisez la Solution 1** (serveur PHP intégré) :
- Double-cliquer sur `start_server.bat`
- Ouvrir `http://localhost:8000/install.php`
- C'est le plus simple et ça fonctionne toujours ! ✅

---

## ❓ Questions fréquentes

**Q : Pourquoi ça ne fonctionne pas avec localhost ?**
R : Votre serveur web (Apache) n'est peut-être pas démarré ou configuré. Utilisez le serveur PHP intégré.

**Q : Le serveur PHP intégré est-il sûr ?**
R : Oui, c'est pour le développement local. En production, utilisez Apache/Nginx.

**Q : Comment arrêter le serveur PHP intégré ?**
R : Appuyer sur `Ctrl+C` dans la fenêtre du serveur.

---

## 📞 Besoin d'aide ?

1. Vérifier `DIAGNOSTIC.md` pour plus de détails
2. Vérifier les logs Apache/PHP
3. Tester avec `test.php` pour voir si PHP fonctionne

