# 📋 Prérequis - Alliance Renov CRM

## ✅ Ce dont vous avez BESOIN

### 1. PHP 8.0 ou supérieur
- **Windows :** Installer depuis [php.net](https://www.php.net/downloads.php) ou utiliser XAMPP/WAMP
- **Linux :** `sudo apt install php php-mysql` (Ubuntu/Debian)
- **Vérifier :** `php -v` dans le terminal

### 2. MySQL 5.7+ ou MariaDB
- **Windows :** Inclus dans XAMPP/WAMP
- **Linux :** `sudo apt install mysql-server`
- **Vérifier :** `mysql --version`

### 3. Serveur web (un des deux)
- **Apache** (recommandé) - Inclus dans XAMPP/WAMP
- **Nginx** - Alternative
- **OU** Serveur PHP intégré : `php -S localhost:8000` (pour développement)

### 4. Extension PHP PDO MySQL
- Normalement inclus avec PHP
- Vérifier : `php -m | grep pdo_mysql`

---

## ❌ Ce dont vous N'AVEZ PAS besoin

### ❌ Node.js
- **PAS nécessaire** - Ce projet n'utilise pas Node.js

### ❌ npm
- **PAS nécessaire** - Pas de dépendances npm à installer

### ❌ Build process
- **PAS nécessaire** - Pas de compilation, pas de webpack, pas de build

### ❌ Composer
- **PAS nécessaire** - Pas de dépendances PHP externes

### ❌ Framework JavaScript
- **PAS nécessaire** - JavaScript vanilla (pas de React, Vue, Angular)

---

## 🚀 Pourquoi pas besoin de npm ?

Ce projet utilise :
- ✅ **PHP pur** (backend)
- ✅ **HTML/CSS/JS vanilla** (frontend)
- ✅ **Pas de framework** - Code simple et direct
- ✅ **Pas de build** - Fichiers prêts à l'emploi

C'est une application **traditionnelle PHP** qui fonctionne directement sans étape de build.

---

## 📦 Installation simple

1. **PHP** ✅ (déjà installé si vous avez XAMPP/WAMP)
2. **MySQL** ✅ (déjà installé si vous avez XAMPP/WAMP)
3. **C'est tout !** 🎉

Pas de `npm install`, pas de `composer install`, pas de build.

---

## 🔍 Vérification rapide

Ouvrir un terminal et taper :
```bash
php -v          # Doit afficher la version PHP
mysql --version # Doit afficher la version MySQL
```

Si les deux fonctionnent, vous êtes prêt ! ✅

---

## 💡 Pourquoi cette approche ?

- ✅ **Simple** - Pas de dépendances complexes
- ✅ **Rapide** - Démarrage immédiat
- ✅ **Portable** - Fonctionne partout où PHP fonctionne
- ✅ **Facile à maintenir** - Code simple et direct
- ✅ **Prêt pour Electron** - Peut être encapsulé facilement

---

## 🎯 Résumé

**Besoin :**
- PHP ✅
- MySQL ✅
- Serveur web (Apache/Nginx) ou serveur PHP intégré ✅

**Pas besoin :**
- Node.js ❌
- npm ❌
- Build process ❌
- Composer ❌

**C'est une application PHP traditionnelle, pas une application moderne avec build process !**

