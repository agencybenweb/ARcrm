@echo off
chcp 65001 >nul
echo ========================================
echo Serveur PHP - Alliance Renov CRM
echo ========================================
echo.

echo Vérification de PHP...
php -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] PHP n'est pas installé ou pas dans le PATH
    echo.
    echo Solutions :
    echo 1. Installer PHP et l'ajouter au PATH
    echo 2. Utiliser XAMPP/WAMP et accéder via http://localhost/ARcrm
    echo.
    pause
    exit /b 1
)

echo [OK] PHP est installé
echo.
echo ========================================
echo Démarrage du serveur PHP
echo ========================================
echo.
echo Le serveur va démarrer sur : http://localhost:8000
echo.
echo Fichiers disponibles :
echo - http://localhost:8000/install.php (Installateur)
echo - http://localhost:8000/test.php (Test PHP)
echo - http://localhost:8000/test_connection.php (Test BDD)
echo - http://localhost:8000 (Application)
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.
echo ========================================
echo.

cd /d "%~dp0"
php -S localhost:8000

pause

