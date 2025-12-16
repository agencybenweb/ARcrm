# ⚡ Démarrage rapide - Alliance Renov CRM

## Installation en 2 minutes

### Option 1 : Installateur automatique (Le plus simple) 🎯

1. **Ouvrir dans le navigateur :**
   ```
   http://localhost/ARcrm/install.php
   ```

2. **Suivre les 5 étapes à l'écran :**
   - Configuration MySQL
   - Création de la base
   - Import du schéma
   - Configuration du fichier
   - C'est terminé !

3. **Se connecter :**
   - URL : `http://localhost/ARcrm`
   - Email : `mathieu@alliancerenov.fr`
   - Mot de passe : `admin123`

---

### Option 2 : Installation manuelle rapide

#### 1. Créer la base de données
```sql
CREATE DATABASE alliance_renov CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 2. Importer le schéma
Via phpMyAdmin ou ligne de commande :
```bash
mysql -u root -p alliance_renov < database/schema.sql
```

#### 3. Configurer (si nécessaire)
Éditer `backend/config/database.php` si vos identifiants MySQL sont différents de :
- User : `root`
- Pass : `` (vide)

#### 4. Tester
Ouvrir : `http://localhost/ARcrm/test_connection.php`

#### 5. Utiliser
Ouvrir : `http://localhost/ARcrm`

---

## 🎯 Identifiants par défaut

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| mathieu@alliancerenov.fr | admin123 | Admin |
| sophie@alliancerenov.fr | admin123 | Collaborateur |

---

## ✅ Vérification rapide

Ouvrir : `http://localhost/ARcrm/test_connection.php`

Si tout est vert ✅, c'est bon !

---

## ❓ Problème ?

1. **Connexion échouée** → Vérifier `backend/config/database.php`
2. **Tables manquantes** → Réimporter `database/schema.sql`
3. **Page blanche** → Vérifier les logs PHP/Apache

Voir `GUIDE_INSTALLATION.md` pour plus de détails.

---

**C'est tout ! 🚀**

