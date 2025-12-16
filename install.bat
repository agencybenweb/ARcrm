@echo off
chcp 65001 >nul
echo ========================================
echo Installation Alliance Renov CRM
echo ========================================
echo.

echo Vérification de PHP...
php -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] PHP n'est pas installé ou pas dans le PATH
    echo Veuillez installer PHP ou ajouter PHP au PATH
    pause
    exit /b 1
)
echo [OK] PHP est installé
echo.

echo Vérification de MySQL...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ATTENTION] MySQL n'est pas dans le PATH
    echo Vous devrez créer la base de données manuellement via phpMyAdmin
    echo.
) else (
    echo [OK] MySQL est installé
    echo.
)

echo ========================================
echo Instructions d'installation
echo ========================================
echo.
echo 1. Créez la base de données MySQL :
echo    - Ouvrez phpMyAdmin : http://localhost/phpmyadmin
echo    - Créez une base nommée : alliance_renov
echo    - Ou utilisez la commande :
echo      mysql -u root -p -e "CREATE DATABASE alliance_renov CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo.
echo 2. Importez le schéma SQL :
echo    - Via phpMyAdmin : Sélectionnez alliance_renov ^> Importer ^> Choisissez database/schema.sql
echo    - Ou via ligne de commande :
echo      mysql -u root -p alliance_renov ^< database/schema.sql
echo.
echo 3. Configurez database.php :
echo    - Éditez backend/config/database.php
echo    - Modifiez DB_USER et DB_PASS si nécessaire
echo.
echo 4. Testez l'installation :
echo    - Ouvrez : http://localhost/ARcrm/test_connection.php
echo    - Ou utilisez l'installateur automatique : http://localhost/ARcrm/install.php
echo.
echo 5. Accédez à l'application :
echo    - URL : http://localhost/ARcrm
echo    - Email : mathieu@alliancerenov.fr
echo    - Mot de passe : admin123
echo.
echo ========================================
echo.

set /p choice="Voulez-vous ouvrir l'installateur automatique dans le navigateur ? (O/N) : "
if /i "%choice%"=="O" (
    echo Ouverture de l'installateur...
    start http://localhost/ARcrm/install.php
) else (
    echo.
    echo Vous pouvez lancer l'installateur manuellement en ouvrant :
    echo http://localhost/ARcrm/install.php
    echo.
)

pause

