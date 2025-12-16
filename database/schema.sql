-- ============================================
-- CRM ALLIANCE RENOV - SCHEMA COMPLET
-- Base de données MySQL
-- ============================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- ============================================
-- TABLE: utilisateurs
-- ============================================
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','collaborateur') NOT NULL DEFAULT 'collaborateur',
  `actif` tinyint(1) NOT NULL DEFAULT 1,
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: clients
-- ============================================
CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `adresse_projet` text DEFAULT NULL,
  `code_postal` varchar(10) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `source_lead` varchar(100) DEFAULT NULL,
  `statut` enum('prospect','en_cours','signe') NOT NULL DEFAULT 'prospect',
  `notes_internes` text DEFAULT NULL,
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `utilisateur_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_client_utilisateur` (`utilisateur_id`),
  CONSTRAINT `fk_client_utilisateur` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: artisans
-- ============================================
CREATE TABLE IF NOT EXISTS `artisans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom_societe` varchar(255) NOT NULL,
  `metier` varchar(100) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `zone_intervention` text DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT 1,
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: projets
-- ============================================
CREATE TABLE IF NOT EXISTS `projets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `type_travaux` varchar(100) NOT NULL,
  `budget_estime` decimal(10,2) DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `statut` enum('a_etudier','en_cours','termine') NOT NULL DEFAULT 'a_etudier',
  `notes` text DEFAULT NULL,
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `utilisateur_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_projet_client` (`client_id`),
  KEY `fk_projet_utilisateur` (`utilisateur_id`),
  CONSTRAINT `fk_projet_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_projet_utilisateur` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: devis
-- ============================================
CREATE TABLE IF NOT EXISTS `devis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projet_id` int(11) NOT NULL,
  `artisan_id` int(11) NOT NULL,
  `numero` varchar(50) DEFAULT NULL,
  `montant` decimal(10,2) NOT NULL,
  `commission` decimal(10,2) DEFAULT NULL,
  `statut` enum('envoye','accepte','refuse') NOT NULL DEFAULT 'envoye',
  `date_devis` date NOT NULL,
  `date_limite` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `utilisateur_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_devis_projet` (`projet_id`),
  KEY `fk_devis_artisan` (`artisan_id`),
  KEY `fk_devis_utilisateur` (`utilisateur_id`),
  CONSTRAINT `fk_devis_projet` FOREIGN KEY (`projet_id`) REFERENCES `projets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_devis_artisan` FOREIGN KEY (`artisan_id`) REFERENCES `artisans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_devis_utilisateur` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: relances
-- ============================================
CREATE TABLE IF NOT EXISTS `relances` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('appel','rdv','relance_devis') NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `projet_id` int(11) DEFAULT NULL,
  `devis_id` int(11) DEFAULT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date_programmee` datetime NOT NULL,
  `statut` enum('a_faire','fait') NOT NULL DEFAULT 'a_faire',
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `utilisateur_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_relance_client` (`client_id`),
  KEY `fk_relance_projet` (`projet_id`),
  KEY `fk_relance_devis` (`devis_id`),
  KEY `fk_relance_utilisateur` (`utilisateur_id`),
  CONSTRAINT `fk_relance_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_relance_projet` FOREIGN KEY (`projet_id`) REFERENCES `projets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_relance_devis` FOREIGN KEY (`devis_id`) REFERENCES `devis` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_relance_utilisateur` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: historique_actions
-- ============================================
CREATE TABLE IF NOT EXISTS `historique_actions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_entite` enum('client','projet','artisan','devis','relance') NOT NULL,
  `entite_id` int(11) NOT NULL,
  `action` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `utilisateur_id` int(11) DEFAULT NULL,
  `date_action` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_historique_utilisateur` (`utilisateur_id`),
  CONSTRAINT `fk_historique_utilisateur` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DONNÉES DE TEST (SEED)
-- ============================================

-- Utilisateur admin par défaut (password: admin123)
-- Hash généré avec: password_hash('admin123', PASSWORD_DEFAULT)
INSERT INTO `utilisateurs` (`nom`, `prenom`, `email`, `password`, `role`) VALUES
('Dubois', 'Mathieu', 'mathieu@alliancerenov.fr', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin'),
('Martin', 'Sophie', 'sophie@alliancerenov.fr', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'collaborateur');

-- Clients de test
INSERT INTO `clients` (`nom`, `prenom`, `telephone`, `email`, `adresse_projet`, `code_postal`, `ville`, `source_lead`, `statut`, `notes_internes`) VALUES
('Dupont', 'Jean', '0612345678', 'jean.dupont@email.com', '45 rue de la République', '38000', 'Grenoble', 'Site web', 'en_cours', 'Client intéressé par une rénovation complète'),
('Bernard', 'Marie', '0623456789', 'marie.bernard@email.com', '12 avenue des Alpes', '38100', 'Grenoble', 'Recommandation', 'prospect', 'Premier contact téléphonique effectué'),
('Martin', 'Pierre', '0634567890', 'pierre.martin@email.com', '78 chemin des Vignes', '38500', 'Voiron', 'Facebook', 'signe', 'Contrat signé, travaux à planifier');

-- Artisans de test
INSERT INTO `artisans` (`nom_societe`, `metier`, `telephone`, `email`, `zone_intervention`, `adresse`, `notes`) VALUES
('Artisan Pro', 'Plomberie', '0412345678', 'contact@artisanpro.fr', 'Isère, Rhône', '10 rue des Artisans, 38000 Grenoble', 'Très réactif, bon rapport qualité/prix'),
('Bâtiment Express', 'Maçonnerie', '0423456789', 'info@batimentexpress.fr', 'Isère', '25 avenue du Bâtiment, 38100 Grenoble', 'Spécialisé en rénovation'),
('Électricité Moderne', 'Électricité', '0434567890', 'contact@elecmoderne.fr', 'Isère, Savoie', '5 rue Volta, 38000 Grenoble', 'Certifié Qualifelec');

-- Projets de test
INSERT INTO `projets` (`client_id`, `titre`, `type_travaux`, `budget_estime`, `date_debut`, `statut`, `notes`) VALUES
(1, 'Rénovation complète appartement', 'Rénovation complète', 45000.00, '2024-03-01', 'en_cours', 'Travaux de plomberie, électricité et peinture'),
(2, 'Refaire la salle de bain', 'Plomberie', 12000.00, NULL, 'a_etudier', 'En attente de devis'),
(3, 'Mise aux normes électriques', 'Électricité', 8000.00, '2024-02-15', 'termine', 'Travaux terminés avec succès');

-- Devis de test
INSERT INTO `devis` (`projet_id`, `artisan_id`, `numero`, `montant`, `commission`, `statut`, `date_devis`, `date_limite`, `notes`) VALUES
(1, 1, 'DEV-2024-001', 15000.00, 1500.00, 'accepte', '2024-01-15', '2024-02-15', 'Devis plomberie accepté'),
(1, 3, 'DEV-2024-002', 12000.00, 1200.00, 'accepte', '2024-01-16', '2024-02-16', 'Devis électricité accepté'),
(2, 1, 'DEV-2024-003', 12500.00, 1250.00, 'envoye', '2024-02-01', '2024-03-01', 'En attente de réponse client');

-- Relances de test
INSERT INTO `relances` (`type`, `client_id`, `projet_id`, `devis_id`, `titre`, `description`, `date_programmee`, `statut`) VALUES
('relance_devis', 2, 2, 3, 'Relance devis salle de bain', 'Appeler le client pour connaître sa décision sur le devis', '2024-02-20 10:00:00', 'a_faire'),
('appel', 1, 1, NULL, 'Appel suivi travaux', 'Faire un point sur l\'avancement des travaux', '2024-02-25 14:00:00', 'a_faire'),
('rdv', 2, 2, NULL, 'Rendez-vous visite', 'Prise de rendez-vous pour visite du chantier', '2024-02-22 09:00:00', 'a_faire');

COMMIT;

