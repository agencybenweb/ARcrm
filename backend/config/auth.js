/**
 * Gestion de l'authentification
 * Alliance Renov CRM - Node.js
 */

class Auth {
    static isLoggedIn(req) {
        return req.session && req.session.userId;
    }

    static isAdmin(req) {
        return req.session && req.session.userRole === 'admin';
    }

    static getUserId(req) {
        return req.session?.userId || null;
    }

    static getUserRole(req) {
        return req.session?.userRole || null;
    }

    static login(req, userId, userRole, userName) {
        req.session.userId = userId;
        req.session.userRole = userRole;
        req.session.userName = userName;
        req.session.lastActivity = Date.now();
    }

    static logout(req) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Erreur lors de la déconnexion:', err);
            }
        });
    }

    static checkSessionTimeout(req, res, next) {
        if (req.session.lastActivity) {
            const timeout = 30 * 60 * 1000; // 30 minutes
            if (Date.now() - req.session.lastActivity > timeout) {
                req.session.destroy();
                return res.status(401).json({ error: 'Session expirée' });
            }
        }
        req.session.lastActivity = Date.now();
        next();
    }

    static requireLogin(req, res, next) {
        if (!this.isLoggedIn(req)) {
            return res.status(401).json({ error: 'Non authentifié' });
        }
        // Vérifier le timeout de session
        if (req.session.lastActivity) {
            const timeout = 30 * 60 * 1000; // 30 minutes
            if (Date.now() - req.session.lastActivity > timeout) {
                req.session.destroy();
                return res.status(401).json({ error: 'Session expirée' });
            }
        }
        req.session.lastActivity = Date.now();
        next();
    }

    static requireAdmin(req, res, next) {
        this.requireLogin(req, res, () => {
            if (!this.isAdmin(req)) {
                return res.status(403).json({ error: 'Accès refusé - Admin requis' });
            }
            next();
        });
    }
}

module.exports = Auth;

