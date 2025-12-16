-- Export de la base de données Railway
-- Date: 2025-12-16T17:36:28.619Z

CREATE DATABASE IF NOT EXISTS `railway` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `railway`;


-- Structure de la table artisans
DROP TABLE IF EXISTS `artisans`;
CREATE TABLE `artisans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom_societe` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `metier` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zone_intervention` text COLLATE utf8mb4_unicode_ci,
  `adresse` text COLLATE utf8mb4_unicode_ci,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `actif` tinyint(1) NOT NULL DEFAULT '1',
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de la table artisans
LOCK TABLES `artisans` WRITE;
INSERT INTO `artisans` (`id`, `nom_societe`, `metier`, `telephone`, `email`, `zone_intervention`, `adresse`, `notes`, `actif`, `date_creation`, `date_modification`) VALUES (1, 'Artisan Pro', 'Plomberie', '0412345678', 'contact@artisanpro.fr', 'Isère, Rhône', '10 rue des Artisans, 38000 Grenoble', 'Très réactif, bon rapport qualité/prix', 1, Tue Dec 16 2025 17:36:11 GMT+0100 (UTC+01:00), NULL);
INSERT INTO `artisans` (`id`, `nom_societe`, `metier`, `telephone`, `email`, `zone_intervention`, `adresse`, `notes`, `actif`, `date_creation`, `date_modification`) VALUES (2, 'Bâtiment Express', 'Maçonnerie', '0423456789', 'info@batimentexpress.fr', 'Isère', '25 avenue du Bâtiment, 38100 Grenoble', 'Spécialisé en rénovation', 1, Tue Dec 16 2025 17:36:11 GMT+0100 (UTC+01:00), NULL);
INSERT INTO `artisans` (`id`, `nom_societe`, `metier`, `telephone`, `email`, `zone_intervention`, `adresse`, `notes`, `actif`, `date_creation`, `date_modification`) VALUES (3, 'Électricité Moderne', 'Électricité', '0434567890', 'contact@elecmoderne.fr', 'Isère, Savoie', '5 rue Volta, 38000 Grenoble', 'Certifié Qualifelec', 1, Tue Dec 16 2025 17:36:11 GMT+0100 (UTC+01:00), NULL);
UNLOCK TABLES;


-- Structure de la table clients
DROP TABLE IF EXISTS `clients`;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adresse_projet` text COLLATE utf8mb4_unicode_ci,
  `code_postal` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ville` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_lead` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statut` enum('prospect','en_cours','signe') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'prospect',
  `notes_internes` text COLLATE utf8mb4_unicode_ci,
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `utilisateur_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_client_utilisateur` (`utilisateur_id`),
  CONSTRAINT `fk_client_utilisateur` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de la table clients
LOCK TABLES `clients` WRITE;
INSERT INTO `clients` (`id`, `nom`, `prenom`, `telephone`, `email`, `adresse_projet`, `code_postal`, `ville`, `source_lead`, `statut`, `notes_internes`, `date_creation`, `date_modification`, `utilisateur_id`) VALUES (1, 'Dupont', 'Jean', '0612345678', 'jean.dupont@email.com', '45 rue de la République', '38000', 'Grenoble', 'Site web', 'en_cours', 'Client intéressé par une rénovation complète', Tue Dec 16 2025 17:36:11 GMT+0100 (UTC+01:00), NULL, NULL);
INSERT INTO `clients` (`id`, `nom`, `prenom`, `telephone`, `email`, `adresse_projet`, `code_postal`, `ville`, `source_lead`, `statut`, `notes_internes`, `date_creation`, `date_modification`, `utilisateur_id`) VALUES (2, 'Bernard', 'Marie', '0623456789', 'marie.bernard@email.com', '12 avenue des Alpes', '38100', 'Grenoble', 'Recommandation', 'prospect', 'Premier contact téléphonique effectué', Tue Dec 16 2025 17:36:11 GMT+0100 (UTC+01:00), NULL, NULL);
INSERT INTO `clients` (`id`, `nom`, `prenom`, `telephone`, `email`, `adresse_projet`, `code_postal`, `ville`, `source_lead`, `statut`, `notes_internes`, `date_creation`, `date_modification`, `utilisateur_id`) VALUES (3, 'Martin', 'Pierre', '0634567890', 'pierre.martin@email.com', '78 chemin des Vignes', '38500', 'Voiron', 'Facebook', 'signe', 'Contrat signé, travaux à planifier', Tue Dec 16 2025 17:36:11 GMT+0100 (UTC+01:00), NULL, NULL);
UNLOCK TABLES;


-- Structure de la table devis
DROP TABLE IF EXISTS `devis`;
CREATE TABLE `devis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `projet_id` int NOT NULL,
  `artisan_id` int NOT NULL,
  `numero` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `montant` decimal(10,2) NOT NULL,
  `commission` decimal(10,2) DEFAULT NULL,
  `statut` enum('envoye','accepte','refuse') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'envoye',
  `date_devis` date NOT NULL,
  `date_limite` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `utilisateur_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_devis_projet` (`projet_id`),
  KEY `fk_devis_artisan` (`artisan_id`),
  KEY `fk_devis_utilisateur` (`utilisateur_id`),
  CONSTRAINT `fk_devis_artisan` FOREIGN KEY (`artisan_id`) REFERENCES `artisans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_devis_projet` FOREIGN KEY (`projet_id`) REFERENCES `projets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_devis_utilisateur` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de la table devis
LOCK TABLES `devis` WRITE;
INSERT INTO `devis` (`id`, `projet_id`, `artisan_id`, `numero`, `montant`, `commission`, `statut`, `date_devis`, `date_limite`, `notes`, `date_creation`, `date_modification`, `utilisateur_id`) VALUES (1, 1, 1, 'DEV-2024-001', '15000.00', '1500.00', 'accepte', Mon Jan 15 2024 00:00:00 GMT+0100 (UTC+01:00), Thu Feb 15 2024 00:00:00 GMT+0100 (UTC+01:00), 'Devis plomberie accepté', Tue Dec 16 2025 17:36:11 GMT+0100 (UTC+01:00), NULL, NULL);
INSERT INTO `devis` (`id`, `projet_id`, `artisan_id`, `numero`, `montant`, `commission`, `statut`, `date_devis`, `date_limite`, `notes`, `date_creation`, `date_modification`, `utilisateur_id`) VALUES (2, 1, 3, 'DEV-2024-002', '12000.00', '1200.00', 'accepte', Tue Jan 16 2024 00:00:00 GMT+0100 (UTC+01:00), Fri Feb 16 2024 00:00:00 GMT+0100 (UTC+01:00), 'Devis électricité accepté', Tue Dec 16 2025 17:36:11 GMT+0100 (UTC+01:00), NULL, NULL);
INSERT INTO `devis` (`id`, `projet_id`, `artisan_id`, `numero`, `montant`, `commission`, `statut`, `date_devis`, `date_limite`, `notes`, `date_creation`, `date_modification`, `utilisateur_id`) VALUES (3, 2, 1, 'DEV-2024-003', '12500.00', '1250.00', 'envoye', Thu Feb 01 2024 00:00:00 GMT+0100 (UTC+01:00), Fri Mar 01 2024 00:00:00 GMT+0100 (UTC+01:00), 'En attente de réponse client', Tue Dec 16 2025 17:36:11 GMT+0100 (UTC+01:00), NULL, NULL);
UNLOCK TABLES;


-- Structure de la table historique_actions
DROP TABLE IF EXISTS `historique_actions`;
CREATE TABLE `historique_actions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type_entite` enum('client','projet','artisan','devis','relance') COLLATE utf8mb4_unicode_ci NOT NULL,
  `entite_id` int NOT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `utilisateur_id` int DEFAULT NULL,
  `date_action` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_historique_utilisateur` (`utilisateur_id`),
  CONSTRAINT `fk_historique_utilisateur` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Structure de la table projets
DROP TABLE IF EXISTS `projets`;
CREATE TABLE `projets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `titre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_travaux` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `budget_estime` decimal(10,2) DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `statut` enum('a_etudier','en_cours','termine') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'a_etudier',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `utilisateur_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_projet_client` (`client_id`),
  KEY `fk_projet_utilisateur` (`utilisateur_id`),
  CONSTRAINT `fk_projet_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_projet_utilisateur` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de la table projets
LOCK TABLES `projets` WRITE;
INSERT INTO `projets` (`id`, `client_id`, `titre`, `type_travaux`, `budget_estime`, `date_debut`, `statut`, `notes`, `date_creation`, `date_modification`, `utilisateur_id`) VALUES (1, 1, 'Rénovation complète appartement', 'Rénovation complète', '45000.00', Fri Mar 01 2024 00:00:00 GMT+0100 (UTC+01:00), 'en_cours', 'Travaux de plomberie, électricité et peinture', Tue Dec 16 2025 17:36:11 GMT+0100 (UTC+01:00), NULL, NULL);
INSERT INTO `projets` (`id`, `client_id`, `titre`, `type_travaux`, `budget_estime`, `date_debut`, `statut`, `notes`, `date_creation`, `date_modification`, `utilisateur_id`) VALUES (2, 2, 'Refaire la salle de bain', 'Plomberie', '12000.00', NULL, 'a_etudier', 'En attente de devis', Tue Dec 16 2025 17:36:11 GMT+0100 (UTC+01:00), NULL, NULL);
INSERT INTO `projets` (`id`, `client_id`, `titre`, `type_travaux`, `budget_estime`, `date_debut`, `statut`, `notes`, `date_creation`, `date_modification`, `utilisateur_id`) VALUES (3, 3, 'Mise aux normes électriques', 'Électricité', '8000.00', Thu Feb 15 2024 00:00:00 GMT+0100 (UTC+01:00), 'termine', 'Travaux terminés avec succès', Tue Dec 16 2025 17:36:11 GMT+0100 (UTC+01:00), NULL, NULL);
UNLOCK TABLES;


-- Structure de la table relances
DROP TABLE IF EXISTS `relances`;
CREATE TABLE `relances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('appel','rdv','relance_devis') COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_id` int DEFAULT NULL,
  `projet_id` int DEFAULT NULL,
  `devis_id` int DEFAULT NULL,
  `titre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `date_programmee` datetime NOT NULL,
  `statut` enum('a_faire','fait') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'a_faire',
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `utilisateur_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_relance_client` (`client_id`),
  KEY `fk_relance_projet` (`projet_id`),
  KEY `fk_relance_devis` (`devis_id`),
  KEY `fk_relance_utilisateur` (`utilisateur_id`),
  CONSTRAINT `fk_relance_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_relance_devis` FOREIGN KEY (`devis_id`) REFERENCES `devis` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_relance_projet` FOREIGN KEY (`projet_id`) REFERENCES `projets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_relance_utilisateur` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de la table relances
LOCK TABLES `relances` WRITE;
INSERT INTO `relances` (`id`, `type`, `client_id`, `projet_id`, `devis_id`, `titre`, `description`, `date_programmee`, `statut`, `date_creation`, `date_modification`, `utilisateur_id`) VALUES (1, 'relance_devis', 2, 2, 3, 'Relance devis salle de bain', 'Appeler le client pour connaître sa décision sur le devis', Tue Feb 20 2024 10:00:00 GMT+0100 (UTC+01:00), 'a_faire', Tue Dec 16 2025 17:36:11 GMT+0100 (UTC+01:00), NULL, NULL);
INSERT INTO `relances` (`id`, `type`, `client_id`, `projet_id`, `devis_id`, `titre`, `description`, `date_programmee`, `statut`, `date_creation`, `date_modification`, `utilisateur_id`) VALUES (2, 'appel', 1, 1, NULL, 'Appel suivi travaux', 'Faire un point sur l''avancement des travaux', Sun Feb 25 2024 14:00:00 GMT+0100 (UTC+01:00), 'a_faire', Tue Dec 16 2025 17:36:11 GMT+0100 (UTC+01:00), NULL, NULL);
INSERT INTO `relances` (`id`, `type`, `client_id`, `projet_id`, `devis_id`, `titre`, `description`, `date_programmee`, `statut`, `date_creation`, `date_modification`, `utilisateur_id`) VALUES (3, 'rdv', 2, 2, NULL, 'Rendez-vous visite', 'Prise de rendez-vous pour visite du chantier', Thu Feb 22 2024 09:00:00 GMT+0100 (UTC+01:00), 'a_faire', Tue Dec 16 2025 17:36:11 GMT+0100 (UTC+01:00), NULL, NULL);
UNLOCK TABLES;


-- Structure de la table utilisateurs
DROP TABLE IF EXISTS `utilisateurs`;
CREATE TABLE `utilisateurs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','collaborateur') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'collaborateur',
  `actif` tinyint(1) NOT NULL DEFAULT '1',
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de la table utilisateurs
LOCK TABLES `utilisateurs` WRITE;
INSERT INTO `utilisateurs` (`id`, `nom`, `prenom`, `email`, `password`, `role`, `actif`, `date_creation`) VALUES (1, 'Dubois', 'Mathieu', 'mathieu@alliancerenov.fr', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', 1, Tue Dec 16 2025 17:36:11 GMT+0100 (UTC+01:00));
INSERT INTO `utilisateurs` (`id`, `nom`, `prenom`, `email`, `password`, `role`, `actif`, `date_creation`) VALUES (2, 'Martin', 'Sophie', 'sophie@alliancerenov.fr', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'collaborateur', 1, Tue Dec 16 2025 17:36:11 GMT+0100 (UTC+01:00));
UNLOCK TABLES;

