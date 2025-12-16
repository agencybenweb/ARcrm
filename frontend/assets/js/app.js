/**
 * Application principale
 * Alliance Renov CRM
 */

let currentUser = null;
let currentPage = 'dashboard';
let editingId = null;

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    setupEventListeners();
});

// Vérifier l'authentification
async function checkAuth() {
    try {
        const response = await API.checkAuth();
        if (response.authenticated) {
            currentUser = response.user;
            showApp();
        } else {
            showLogin();
        }
    } catch (error) {
        showLogin();
    }
}

// Afficher la page de connexion
function showLogin() {
    document.getElementById('login-page').classList.add('active');
    document.getElementById('app-page').classList.remove('active');
}

// Afficher l'application
function showApp() {
    console.log('showApp appelé, currentUser:', currentUser);
    const loginPage = document.getElementById('login-page');
    const appPage = document.getElementById('app-page');
    
    if (loginPage) loginPage.classList.remove('active');
    if (appPage) appPage.classList.add('active');
    
    const userNameEl = document.getElementById('user-name');
    const userAvatarEl = document.getElementById('user-avatar-initials');
    if (userNameEl && currentUser) {
        userNameEl.textContent = `${currentUser.prenom} ${currentUser.nom}`;
    }
    if (userAvatarEl && currentUser) {
        // Initiales du nom et prénom
        const initials = (currentUser.prenom?.[0] || '') + (currentUser.nom?.[0] || '');
        userAvatarEl.textContent = initials.toUpperCase() || 'U';
    }
    
    // Forcer le scroll en haut de la page
    window.scrollTo(0, 0);
    
    // Charger la page
    loadPage(currentPage);
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Login
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            navigateToPage(page);
        });
    });

    // Recherches avec gestion des filtres actifs
    document.getElementById('client-search')?.addEventListener('input', debounce(() => loadClients(), 300));
    const clientFilterStatut = document.getElementById('client-filter-statut');
    if (clientFilterStatut) {
        clientFilterStatut.addEventListener('change', (e) => {
            updateFilterState('client-filter-statut', e.target.value);
            loadClients();
        });
    }
    
    document.getElementById('projet-search')?.addEventListener('input', debounce(() => loadProjets(), 300));
    const projetFilterStatut = document.getElementById('projet-filter-statut');
    if (projetFilterStatut) {
        projetFilterStatut.addEventListener('change', (e) => {
            updateFilterState('projet-filter-statut', e.target.value);
            loadProjets();
        });
    }
    
    document.getElementById('artisan-search')?.addEventListener('input', debounce(() => loadArtisans(), 300));
    const artisanFilterMetier = document.getElementById('artisan-filter-metier');
    if (artisanFilterMetier) {
        artisanFilterMetier.addEventListener('change', (e) => {
            updateFilterState('artisan-filter-metier', e.target.value);
            loadArtisans();
        });
    }
    
    const devisFilterStatut = document.getElementById('devis-filter-statut');
    if (devisFilterStatut) {
        devisFilterStatut.addEventListener('change', (e) => {
            updateFilterState('devis-filter-statut', e.target.value);
            loadDevis();
        });
    }
    
    const relanceFilterStatut = document.getElementById('relance-filter-statut');
    if (relanceFilterStatut) {
        relanceFilterStatut.addEventListener('change', (e) => {
            updateFilterState('relance-filter-statut', e.target.value);
            loadRelances();
        });
    }
    
    const relanceFilterType = document.getElementById('relance-filter-type');
    if (relanceFilterType) {
        relanceFilterType.addEventListener('change', (e) => {
            updateFilterState('relance-filter-type', e.target.value);
            loadRelances();
        });
    }
    
    // Ajouter les écouteurs pour le filtre commerciaux
    const commercialFilterRole = document.getElementById('commercial-filter-role');
    if (commercialFilterRole) {
        commercialFilterRole.addEventListener('change', (e) => {
            updateFilterState('commercial-filter-role', e.target.value);
            loadCommerciaux();
        });
    }
    
    // Ajouter l'écouteur pour la recherche commerciaux
    const commercialSearch = document.getElementById('commercial-search');
    if (commercialSearch) {
        commercialSearch.addEventListener('input', debounce(() => loadCommerciaux(), 300));
    }
    
    // Initialiser les états des filtres au chargement
    updateAllFilterStates();
    
    // Initialiser le tri des tableaux après le chargement initial
    setTimeout(() => {
        initTableSorting();
    }, 500);
}

// Gestion de la connexion
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = ''; // Effacer les erreurs précédentes

    try {
        console.log('Tentative de connexion...');
        const response = await API.login(email, password);
        console.log('Réponse login:', response);
        
        if (response && response.user) {
            currentUser = response.user;
            console.log('Utilisateur connecté:', currentUser);
            showApp();
        } else {
            throw new Error('Réponse invalide du serveur');
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        errorDiv.textContent = error.message || 'Erreur de connexion';
    }
}

// Gestion de la déconnexion
async function handleLogout() {
    try {
        // Fermer la modal d'abord
        closeModal();
        // Attendre un peu pour que la modal se ferme visuellement
        await new Promise(resolve => setTimeout(resolve, 300));
        // Déconnecter
        await API.logout();
        showLogin();
    } catch (error) {
        console.error('Logout error:', error);
        // Fermer la modal même en cas d'erreur
        closeModal();
        showLogin();
    }
}

// Navigation
function navigateToPage(page) {
    currentPage = page;
    
    // Mettre à jour la navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });

    // Mettre à jour le titre
    const titles = {
        dashboard: 'Dashboard',
        clients: 'Clients',
        projets: 'Projets',
        artisans: 'Artisans',
        devis: 'Devis',
        relances: 'Relances',
        commerciaux: 'Commerciaux'
    };
    document.getElementById('page-title').textContent = titles[page] || 'Dashboard';

    // Afficher la page
    document.querySelectorAll('.content-page').forEach(p => p.classList.remove('active'));
    document.getElementById(`${page}-page`).classList.add('active');

    // Charger les données
    loadPage(page);
}

// Charger une page
function loadPage(page) {
    switch (page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'clients':
            loadClients();
            break;
        case 'projets':
            loadProjets();
            break;
        case 'artisans':
            loadArtisans();
            break;
        case 'devis':
            loadDevis();
            break;
        case 'relances':
            loadRelances();
            break;
        case 'commerciaux':
            loadCommerciaux();
            break;
    }
}

// Dashboard
async function loadDashboard() {
    try {
        console.log('Chargement du dashboard...');
        const stats = await API.getDashboardStats();
        console.log('Données reçues du dashboard:', stats);
        
        if (!stats) {
            console.error('Aucune donnée reçue du dashboard');
            return;
        }
        
        // Afficher les statistiques
        const statClients = document.getElementById('stat-clients');
        const statProjets = document.getElementById('stat-projets');
        const statDevis = document.getElementById('stat-devis');
        const statRelances = document.getElementById('stat-relances');
        const statMontant = document.getElementById('stat-montant');
        const statCommission = document.getElementById('stat-commission');
        
        if (statClients) statClients.textContent = stats.nb_clients || 0;
        if (statProjets) statProjets.textContent = stats.projets_en_cours || 0;
        if (statDevis) statDevis.textContent = stats.devis_en_attente || 0;
        if (statRelances) statRelances.textContent = stats.relances_a_venir || 0;
        if (statMontant) statMontant.textContent = formatCurrency(stats.montant_total_devis || 0);
        if (statCommission) statCommission.textContent = formatCurrency(stats.commission_potentielle || 0);
        
        console.log('Statistiques affichées:', {
            clients: stats.nb_clients,
            projets: stats.projets_en_cours,
            devis: stats.devis_en_attente,
            relances: stats.relances_a_venir
        });

    } catch (error) {
        console.error('Error loading dashboard:', error);
        // Afficher un message d'erreur à l'utilisateur
        const relancesDiv = document.getElementById('upcoming-relances');
        if (relancesDiv) {
            relancesDiv.innerHTML = '<p style="color: var(--danger-color);">Erreur lors du chargement des données</p>';
        }
    }
}

// Clients
async function loadClients() {
    try {
        const filters = {};
        const search = document.getElementById('client-search')?.value;
        const statut = document.getElementById('client-filter-statut')?.value;
        
        if (search) filters.search = search;
        if (statut) filters.statut = statut;

        const clients = await API.getClients(filters);
        const tbody = document.querySelector('#clients-table tbody');
        
        tbody.innerHTML = clients.map(client => `
            <tr>
                <td class="view-cell">
                    <button class="view-btn" onclick="viewClient(${client.id})" title="Voir la fiche">
                        <span class="view-icon">👁️</span>
                    </button>
                </td>
                <td>${client.prenom} ${client.nom}</td>
                <td>${client.telephone || '-'}</td>
                <td>${client.email || '-'}</td>
                <td>${client.adresse_projet || '-'}</td>
                <td>${client.source_lead || '-'}</td>
                <td><span class="badge badge-${client.statut}">${formatStatut(client.statut)}</span></td>
                <td class="actions">
                    <button class="btn btn-sm btn-primary" onclick="editClient(${client.id})">Éditer</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteClient(${client.id})">Supprimer</button>
                </td>
            </tr>
        `).join('');
        
        // Mettre à jour l'état des filtres après le chargement
        const clientFilterStatut = document.getElementById('client-filter-statut');
        if (clientFilterStatut) {
            updateFilterState('client-filter-statut', clientFilterStatut.value || '');
        }
        
        // Réinitialiser le tri après le chargement
        setTimeout(() => initTableSorting(), 100);
    } catch (error) {
        console.error('Error loading clients:', error);
    }
}

// Projets
async function loadProjets() {
    try {
        const filters = {};
        const search = document.getElementById('projet-search')?.value;
        const statut = document.getElementById('projet-filter-statut')?.value;
        const clientId = document.getElementById('projet-filter-client')?.value;
        
        if (search) filters.search = search;
        if (statut) filters.statut = statut;
        if (clientId) filters.client_id = clientId;

        const projets = await API.getProjets(filters);
        const tbody = document.querySelector('#projets-table tbody');
        
        tbody.innerHTML = projets.map(projet => {
            const commercialName = projet.utilisateur_prenom && projet.utilisateur_nom 
                ? `${projet.utilisateur_prenom} ${projet.utilisateur_nom}` 
                : '<span style="color: var(--text-secondary); font-style: italic;">Non assigné</span>';
            
            return `
            <tr>
                <td class="view-cell">
                    <button class="view-btn" onclick="viewProjet(${projet.id})" title="Voir la fiche">
                        <span class="view-icon">👁️</span>
                    </button>
                </td>
                <td>${projet.titre}</td>
                <td>${projet.client_prenom} ${projet.client_nom}</td>
                <td>${projet.type_travaux}</td>
                <td>${projet.budget_estime ? formatCurrency(projet.budget_estime) : '-'}</td>
                <td>${projet.date_debut ? formatDate(projet.date_debut) : '-'}</td>
                <td>${commercialName}</td>
                <td><span class="badge badge-${projet.statut}">${formatStatut(projet.statut)}</span></td>
                <td class="actions">
                    <button class="btn btn-sm btn-primary" onclick="editProjet(${projet.id})">Éditer</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProjet(${projet.id})">Supprimer</button>
                </td>
            </tr>
        `;
        }).join('');
        
        // Réinitialiser le tri après le chargement
        setTimeout(() => initTableSorting(), 100);
    } catch (error) {
        console.error('Error loading projets:', error);
    }
}

// Artisans
async function loadArtisans() {
    try {
        const filters = {};
        const search = document.getElementById('artisan-search')?.value;
        const metier = document.getElementById('artisan-filter-metier')?.value;
        
        if (search) filters.search = search;
        if (metier) filters.metier = metier;

        const artisans = await API.getArtisans(filters);
        const tbody = document.querySelector('#artisans-table tbody');
        
        tbody.innerHTML = artisans.map(artisan => `
            <tr>
                <td class="view-cell">
                    <button class="view-btn" onclick="viewArtisan(${artisan.id})" title="Voir la fiche">
                        <span class="view-icon">👁️</span>
                    </button>
                </td>
                <td>${artisan.nom_societe}</td>
                <td>${artisan.metier}</td>
                <td>${artisan.telephone || '-'}</td>
                <td>${artisan.email || '-'}</td>
                <td>${artisan.zone_intervention || '-'}</td>
                <td class="actions">
                    <button class="btn btn-sm btn-primary" onclick="editArtisan(${artisan.id})">Éditer</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteArtisan(${artisan.id})">Supprimer</button>
                </td>
            </tr>
        `).join('');
        
        // Réinitialiser le tri après le chargement
        setTimeout(() => initTableSorting(), 100);
    } catch (error) {
        console.error('Error loading artisans:', error);
    }
}

// Devis
async function loadDevis() {
    try {
        const filters = {};
        const statut = document.getElementById('devis-filter-statut')?.value;
        const projetId = document.getElementById('devis-filter-projet')?.value;
        const artisanId = document.getElementById('devis-filter-artisan')?.value;
        
        if (statut) filters.statut = statut;
        if (projetId) filters.projet_id = projetId;
        if (artisanId) filters.artisan_id = artisanId;

        const devis = await API.getDevis(filters);
        const tbody = document.querySelector('#devis-table tbody');
        
        tbody.innerHTML = devis.map(devi => {
            const commercialName = devi.utilisateur_prenom && devi.utilisateur_nom 
                ? `${devi.utilisateur_prenom} ${devi.utilisateur_nom}` 
                : '<span style="color: var(--text-secondary); font-style: italic;">Non assigné</span>';
            
            return `
            <tr>
                <td class="view-cell">
                    <button class="view-btn" onclick="viewDevis(${devi.id})" title="Voir la fiche">
                        <span class="view-icon">👁️</span>
                    </button>
                </td>
                <td>${devi.numero || '-'}</td>
                <td>${devi.projet_titre || '-'}</td>
                <td>${devi.client_prenom} ${devi.client_nom}</td>
                <td>${devi.artisan_nom || '-'}</td>
                <td>${formatCurrency(devi.montant)}</td>
                <td>${devi.commission ? formatCurrency(devi.commission) : '-'}</td>
                <td>${commercialName}</td>
                <td><span class="badge badge-${devi.statut}">${formatStatut(devi.statut)}</span></td>
                <td>${formatDate(devi.date_devis)}</td>
                <td class="actions">
                    <button class="btn btn-sm btn-primary" onclick="editDevis(${devi.id})">Éditer</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDevis(${devi.id})">Supprimer</button>
                </td>
            </tr>
        `;
        }).join('');
        
        // Mettre à jour l'état des filtres après le chargement
        updateFilterState('devis-filter-statut', document.getElementById('devis-filter-statut')?.value || '');
        
        // Réinitialiser le tri après le chargement
        setTimeout(() => initTableSorting(), 100);
    } catch (error) {
        console.error('Error loading devis:', error);
    }
}

// Relances
async function loadRelances() {
    try {
        const filters = {};
        const statut = document.getElementById('relance-filter-statut')?.value;
        const type = document.getElementById('relance-filter-type')?.value;
        
        if (statut) filters.statut = statut;
        if (type) filters.type = type;

        const relances = await API.getRelances(filters);
        const tbody = document.querySelector('#relances-table tbody');
        
        tbody.innerHTML = relances.map(relance => `
            <tr>
                <td class="view-cell">
                    <button class="view-btn" onclick="viewRelance(${relance.id})" title="Voir la fiche">
                        <span class="view-icon">👁️</span>
                    </button>
                </td>
                <td>${formatTypeRelance(relance.type)}</td>
                <td>${relance.titre}</td>
                <td>${relance.client_nom ? relance.client_nom + ' ' + relance.client_prenom : '-'}</td>
                <td>${relance.projet_titre || '-'}</td>
                <td>${formatDateTime(relance.date_programmee)}</td>
                <td><span class="badge badge-${relance.statut}">${formatStatut(relance.statut)}</span></td>
                <td class="actions">
                    <button class="btn btn-sm btn-primary" onclick="editRelance(${relance.id})">Éditer</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteRelance(${relance.id})">Supprimer</button>
                </td>
            </tr>
        `).join('');
        
        // Réinitialiser le tri après le chargement
        setTimeout(() => initTableSorting(), 100);
    } catch (error) {
        console.error('Error loading relances:', error);
    }
}

// Modals - Clients
function openClientModal(id = null) {
    editingId = id;
    const title = id ? 'Modifier le client' : 'Nouveau client';
    document.getElementById('modal-title').textContent = title;
    
    if (id) {
        loadClientData(id);
    } else {
        document.getElementById('modal-body').innerHTML = getClientForm();
        loadUtilisateursForSelect('client-commercial-select');
        // Attacher l'événement submit pour la création
        setTimeout(() => {
            attachClientFormSubmit();
        }, 100);
    }
    
    openModalWithScroll();
}

async function loadUtilisateursForSelect(selectId, selectedId = null) {
    try {
        const utilisateurs = await API.getUtilisateurs();
        const select = document.getElementById(selectId);
        if (select) {
            const options = utilisateurs.map(u => 
                `<option value="${u.id}" ${selectedId == u.id ? 'selected' : ''}>${u.prenom} ${u.nom}${u.role === 'admin' ? ' (Admin)' : ''}</option>`
            ).join('');
            select.innerHTML = '<option value="">Non assigné</option>' + options;
        }
    } catch (error) {
        console.error('Erreur loadUtilisateursForSelect:', error);
    }
}

async function loadClientData(id) {
    try {
        const client = await API.getClient(id);
        document.getElementById('modal-body').innerHTML = getClientForm(client);
        await loadUtilisateursForSelect('client-commercial-select', client?.utilisateur_id);
        // Attacher l'événement submit pour la modification
        setTimeout(() => {
            attachClientFormSubmit();
        }, 100);
    } catch (error) {
        alert('Erreur lors du chargement du client');
    }
}

function attachClientFormSubmit() {
    const form = document.getElementById('client-form');
    if (form) {
        // Retirer l'ancien listener s'il existe
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        // Attacher le nouveau listener
        document.getElementById('client-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            console.log('Soumission formulaire client, editingId:', editingId);
            console.log('Données:', data);
            
            try {
                if (editingId) {
                    console.log('Mise à jour client', editingId);
                    await API.updateClient(editingId, data);
                } else {
                    console.log('Création nouveau client');
                    await API.createClient(data);
                }
                closeModal();
                loadClients();
                // Rafraîchir le dashboard si on est sur la page dashboard
                if (currentPage === 'dashboard') {
                    loadDashboard();
                }
            } catch (error) {
                console.error('Erreur client:', error);
                alert('Erreur: ' + error.message);
            }
        });
    }
}

function getClientForm(client = null) {
    return `
        <form id="client-form">
            <div class="form-group">
                <label>Nom *</label>
                <input type="text" name="nom" value="${client?.nom || ''}" required>
            </div>
            <div class="form-group">
                <label>Prénom *</label>
                <input type="text" name="prenom" value="${client?.prenom || ''}" required>
            </div>
            <div class="form-group">
                <label>Téléphone</label>
                <input type="tel" name="telephone" value="${client?.telephone || ''}">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" value="${client?.email || ''}">
            </div>
            <div class="form-group">
                <label>Adresse du projet</label>
                <input type="text" name="adresse_projet" value="${client?.adresse_projet || ''}">
            </div>
            <div class="form-group">
                <label>Code postal</label>
                <input type="text" name="code_postal" value="${client?.code_postal || ''}">
            </div>
            <div class="form-group">
                <label>Ville</label>
                <input type="text" name="ville" value="${client?.ville || ''}">
            </div>
            <div class="form-group">
                <label>Source du lead</label>
                <input type="text" name="source_lead" value="${client?.source_lead || ''}">
            </div>
            <div class="form-group">
                <label>Statut</label>
                <select name="statut" required>
                    <option value="prospect" ${client?.statut === 'prospect' ? 'selected' : ''}>Prospect</option>
                    <option value="en_cours" ${client?.statut === 'en_cours' ? 'selected' : ''}>En cours</option>
                    <option value="signe" ${client?.statut === 'signe' ? 'selected' : ''}>Signé</option>
                </select>
            </div>
            <div class="form-group">
                <label>Commercial assigné</label>
                <select name="utilisateur_id" id="client-commercial-select">
                    <option value="">Non assigné</option>
                </select>
            </div>
            <div class="form-group">
                <label>Notes internes</label>
                <textarea name="notes_internes">${client?.notes_internes || ''}</textarea>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Annuler</button>
                <button type="submit" class="btn btn-primary">Enregistrer</button>
            </div>
        </form>
    `;
}

async function editClient(id) {
    openClientModal(id);
    // L'événement submit est maintenant attaché dans loadClientData ou openClientModal
}

async function deleteClient(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
        try {
            await API.deleteClient(id);
            loadClients();
            // Rafraîchir le dashboard si on est sur la page dashboard
            if (currentPage === 'dashboard') {
                loadDashboard();
            }
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    }
}

// Voir la fiche client détaillée
async function viewClient(id) {
    try {
        const client = await API.getClient(id);
        if (!client) {
            alert('Client non trouvé');
            return;
        }

        // Créer le contenu de la fiche client
        const initials = (client.prenom?.[0] || '') + (client.nom?.[0] || '');
        const fullName = `${client.prenom} ${client.nom}`;
        
        document.getElementById('modal-title').textContent = 'Fiche Client';
        document.getElementById('modal-body').innerHTML = `
            <div class="client-profile-view">
                <div class="client-profile-header">
                    <div class="client-avatar-large">
                        <span>${initials.toUpperCase()}</span>
                    </div>
                    <div class="client-profile-info">
                        <h2>${fullName}</h2>
                        <span class="badge badge-${client.statut}">${formatStatut(client.statut)}</span>
                    </div>
                </div>
                
                <div class="client-profile-content">
                    <div class="info-section">
                        <h3>📞 Contact</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Téléphone</label>
                                <p>${client.telephone || 'Non renseigné'}</p>
                            </div>
                            <div class="info-item">
                                <label>Email</label>
                                <p>${client.email || 'Non renseigné'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h3>📍 Adresse du projet</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Adresse</label>
                                <p>${client.adresse_projet || 'Non renseigné'}</p>
                            </div>
                            <div class="info-item">
                                <label>Code postal</label>
                                <p>${client.code_postal || 'Non renseigné'}</p>
                            </div>
                            <div class="info-item">
                                <label>Ville</label>
                                <p>${client.ville || 'Non renseigné'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h3>📊 Informations</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Commercial assigné</label>
                                <p>${client.utilisateur_prenom && client.utilisateur_nom ? `${client.utilisateur_prenom} ${client.utilisateur_nom}` : 'Non assigné'}</p>
                            </div>
                            <div class="info-item">
                                <label>Source du lead</label>
                                <p>${client.source_lead || 'Non renseigné'}</p>
                            </div>
                            <div class="info-item">
                                <label>Date de création</label>
                                <p>${client.date_creation ? formatDate(client.date_creation) : 'Non renseigné'}</p>
                            </div>
                        </div>
                    </div>
                    
                    ${client.notes_internes ? `
                    <div class="info-section">
                        <h3>📝 Notes internes</h3>
                        <div class="notes-content">
                            <p>${client.notes_internes}</p>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="info-section">
                        <h3>🔗 Liens</h3>
                        <div class="links-section">
                            <button class="btn btn-sm btn-primary" onclick="viewClientProjets(${client.id}, '${client.prenom} ${client.nom}');" style="margin-right: 10px;">
                                Voir les projets (${client.nb_projets || 0})
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Fermer</button>
                    <button type="button" class="btn btn-primary" onclick="closeModal(); editClient(${client.id})">Modifier</button>
                </div>
            </div>
        `;
        
        openModalWithScroll();
    } catch (error) {
        console.error('Erreur viewClient:', error);
        alert('Erreur lors du chargement de la fiche client');
    }
}

// Voir le profil utilisateur
async function viewProfile() {
    if (!currentUser) {
        alert('Utilisateur non connecté');
        return;
    }

    const initials = (currentUser.prenom?.[0] || '') + (currentUser.nom?.[0] || '');
    const fullName = `${currentUser.prenom} ${currentUser.nom}`;
    
    document.getElementById('modal-title').textContent = 'Mon Profil';
    document.getElementById('modal-body').innerHTML = `
        <div class="user-profile-view">
            <div class="user-profile-header">
                <div class="user-avatar-large">
                    <span>${initials.toUpperCase()}</span>
                </div>
                <div class="user-profile-info">
                    <h2>${fullName}</h2>
                    <span class="badge badge-${currentUser.role}">${currentUser.role === 'admin' ? 'Administrateur' : 'Collaborateur'}</span>
                </div>
            </div>
            
            <div class="user-profile-content">
                <div class="info-section">
                    <h3>👤 Informations personnelles</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>Nom</label>
                            <p>${currentUser.nom}</p>
                        </div>
                        <div class="info-item">
                            <label>Prénom</label>
                            <p>${currentUser.prenom}</p>
                        </div>
                        <div class="info-item">
                            <label>Email</label>
                            <p>${currentUser.email}</p>
                        </div>
                        <div class="info-item">
                            <label>Rôle</label>
                            <p>${currentUser.role === 'admin' ? 'Administrateur' : 'Collaborateur'}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Fermer</button>
                <button type="button" class="btn btn-danger" onclick="handleLogout()">Déconnexion</button>
            </div>
        </div>
    `;
    
    const modalBody = document.getElementById('modal-body');
    if (modalBody) {
        modalBody.scrollTop = 0;
    }
    openModalWithScroll();
}

function exportClients() {
    API.exportClients();
}

// Modals - Projets
function openProjetModal(id = null) {
    editingId = id;
    const title = id ? 'Modifier le projet' : 'Nouveau projet';
    document.getElementById('modal-title').textContent = title;
    
    if (id) {
        loadProjetData(id);
    } else {
        loadClientsForSelect().then(async () => {
            document.getElementById('modal-body').innerHTML = getProjetForm();
            await loadUtilisateursForSelect('projet-commercial-select');
            setTimeout(() => {
                attachProjetFormSubmit();
            }, 100);
        });
    }
    
    openModalWithScroll();
}

async function loadProjetData(id) {
    try {
        const projet = await API.getProjet(id);
        await loadClientsForSelect();
        document.getElementById('modal-body').innerHTML = getProjetForm(projet);
        await loadUtilisateursForSelect('projet-commercial-select', projet?.utilisateur_id);
        setTimeout(() => {
            attachProjetFormSubmit();
        }, 100);
    } catch (error) {
        alert('Erreur lors du chargement du projet');
    }
}

function attachProjetFormSubmit() {
    const form = document.getElementById('projet-form');
    if (form) {
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        document.getElementById('projet-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                if (editingId) {
                    await API.updateProjet(editingId, data);
                } else {
                    await API.createProjet(data);
                }
                closeModal();
                loadProjets();
                // Rafraîchir le dashboard si on est sur la page dashboard
                if (currentPage === 'dashboard') {
                    loadDashboard();
                }
            } catch (error) {
                alert('Erreur: ' + error.message);
            }
        });
    }
}

async function loadClientsForSelect() {
    try {
        const clients = await API.getClients();
        window.clientsList = clients;
    } catch (error) {
        console.error('Error loading clients:', error);
    }
}

function getProjetForm(projet = null) {
    const clientsOptions = (window.clientsList || []).map(c => 
        `<option value="${c.id}" ${projet?.client_id == c.id ? 'selected' : ''}>${c.prenom} ${c.nom}</option>`
    ).join('');
    
    return `
        <form id="projet-form">
            <div class="form-group">
                <label>Client *</label>
                <select name="client_id" required>
                    <option value="">Sélectionner un client</option>
                    ${clientsOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Titre *</label>
                <input type="text" name="titre" value="${projet?.titre || ''}" required>
            </div>
            <div class="form-group">
                <label>Type de travaux *</label>
                <input type="text" name="type_travaux" value="${projet?.type_travaux || ''}" required>
            </div>
            <div class="form-group">
                <label>Budget estimé (€)</label>
                <input type="number" step="0.01" name="budget_estime" value="${projet?.budget_estime || ''}">
            </div>
            <div class="form-group">
                <label>Date de début</label>
                <input type="date" name="date_debut" value="${projet?.date_debut || ''}">
            </div>
            <div class="form-group">
                <label>Statut</label>
                <select name="statut" required>
                    <option value="a_etudier" ${projet?.statut === 'a_etudier' ? 'selected' : ''}>À étudier</option>
                    <option value="en_cours" ${projet?.statut === 'en_cours' ? 'selected' : ''}>En cours</option>
                    <option value="termine" ${projet?.statut === 'termine' ? 'selected' : ''}>Terminé</option>
                </select>
            </div>
            <div class="form-group">
                <label>Commercial assigné</label>
                <select name="utilisateur_id" id="projet-commercial-select">
                    <option value="">Non assigné</option>
                </select>
            </div>
            <div class="form-group">
                <label>Notes</label>
                <textarea name="notes">${projet?.notes || ''}</textarea>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Annuler</button>
                <button type="submit" class="btn btn-primary">Enregistrer</button>
            </div>
        </form>
    `;
}

async function editProjet(id) {
    openProjetModal(id);
    // L'événement submit est maintenant attaché dans loadProjetData ou openProjetModal
}

// Voir la fiche projet détaillée
async function viewProjet(id) {
    try {
        const projet = await API.getProjet(id);
        if (!projet) {
            alert('Projet non trouvé');
            return;
        }

        document.getElementById('modal-title').textContent = 'Fiche Projet';
        document.getElementById('modal-body').innerHTML = `
            <div class="client-profile-view">
                <div class="client-profile-header">
                    <div class="client-avatar-large">
                        <span>🏗️</span>
                    </div>
                    <div class="client-profile-info">
                        <h2>${projet.titre || 'Sans titre'}</h2>
                        <span class="badge badge-${projet.statut}">${formatStatut(projet.statut)}</span>
                    </div>
                </div>
                
                <div class="client-profile-content">
                    <div class="info-section">
                        <h3>👤 Client</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Client</label>
                                <p>${projet.client_prenom || ''} ${projet.client_nom || ''}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h3>📋 Détails du projet</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Type de travaux</label>
                                <p>${projet.type_travaux || 'Non renseigné'}</p>
                            </div>
                            <div class="info-item">
                                <label>Budget estimé</label>
                                <p>${projet.budget_estime ? formatCurrency(projet.budget_estime) : 'Non renseigné'}</p>
                            </div>
                            <div class="info-item">
                                <label>Date de début</label>
                                <p>${projet.date_debut ? formatDate(projet.date_debut) : 'Non renseigné'}</p>
                            </div>
                            <div class="info-item">
                                <label>Date de création</label>
                                <p>${projet.date_creation ? formatDate(projet.date_creation) : 'Non renseigné'}</p>
                            </div>
                            <div class="info-item">
                                <label>Commercial assigné</label>
                                <p>${projet.utilisateur_prenom && projet.utilisateur_nom ? `${projet.utilisateur_prenom} ${projet.utilisateur_nom}` : 'Non assigné'}</p>
                            </div>
                        </div>
                    </div>
                    
                    ${projet.notes ? `
                    <div class="info-section">
                        <h3>📝 Notes</h3>
                        <div class="notes-content">
                            <p>${projet.notes}</p>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="info-section">
                        <h3>🔗 Liens</h3>
                        <div class="links-section">
                            <button class="btn btn-sm btn-primary" onclick="closeModal(); viewClient(${projet.client_id})" style="margin-right: 10px;">
                                Voir le client
                            </button>
                            <button class="btn btn-sm btn-primary" onclick="closeModal(); navigateToPage('devis'); setTimeout(() => { const filter = document.getElementById('devis-filter-projet'); if (filter) filter.value = '${projet.id}'; loadDevis(); }, 100);">
                                Voir les devis (${projet.nb_devis || 0})
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Fermer</button>
                    <button type="button" class="btn btn-primary" onclick="closeModal(); editProjet(${projet.id})">Modifier</button>
                </div>
            </div>
        `;
        
        openModalWithScroll();
    } catch (error) {
        console.error('Erreur viewProjet:', error);
        alert('Erreur lors du chargement de la fiche projet');
    }
}

async function deleteProjet(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
        try {
            await API.deleteProjet(id);
            loadProjets();
            // Rafraîchir le dashboard si on est sur la page dashboard
            if (currentPage === 'dashboard') {
                loadDashboard();
            }
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    }
}

// Modals - Artisans
function openArtisanModal(id = null) {
    editingId = id;
    const title = id ? 'Modifier l\'artisan' : 'Nouvel artisan';
    document.getElementById('modal-title').textContent = title;
    
    if (id) {
        loadArtisanData(id);
    } else {
        document.getElementById('modal-body').innerHTML = getArtisanForm();
        setTimeout(() => {
            attachArtisanFormSubmit();
        }, 100);
    }
    
    openModalWithScroll();
}

async function loadArtisanData(id) {
    try {
        const artisan = await API.getArtisan(id);
        document.getElementById('modal-body').innerHTML = getArtisanForm(artisan);
        setTimeout(() => {
            attachArtisanFormSubmit();
        }, 100);
    } catch (error) {
        alert('Erreur lors du chargement de l\'artisan');
    }
}

function attachArtisanFormSubmit() {
    const form = document.getElementById('artisan-form');
    if (form) {
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        document.getElementById('artisan-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                if (editingId) {
                    await API.updateArtisan(editingId, data);
                } else {
                    await API.createArtisan(data);
                }
                closeModal();
                loadArtisans();
                // Rafraîchir le dashboard si on est sur la page dashboard
                if (currentPage === 'dashboard') {
                    loadDashboard();
                }
            } catch (error) {
                alert('Erreur: ' + error.message);
            }
        });
    }
}

function getArtisanForm(artisan = null) {
    return `
        <form id="artisan-form">
            <div class="form-group">
                <label>Nom de la société *</label>
                <input type="text" name="nom_societe" value="${artisan?.nom_societe || ''}" required>
            </div>
            <div class="form-group">
                <label>Métier *</label>
                <input type="text" name="metier" value="${artisan?.metier || ''}" required>
            </div>
            <div class="form-group">
                <label>Téléphone</label>
                <input type="tel" name="telephone" value="${artisan?.telephone || ''}">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" value="${artisan?.email || ''}">
            </div>
            <div class="form-group">
                <label>Zone d'intervention</label>
                <input type="text" name="zone_intervention" value="${artisan?.zone_intervention || ''}">
            </div>
            <div class="form-group">
                <label>Adresse</label>
                <input type="text" name="adresse" value="${artisan?.adresse || ''}">
            </div>
            <div class="form-group">
                <label>Notes</label>
                <textarea name="notes">${artisan?.notes || ''}</textarea>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Annuler</button>
                <button type="submit" class="btn btn-primary">Enregistrer</button>
            </div>
        </form>
    `;
}

async function editArtisan(id) {
    openArtisanModal(id);
    // L'événement submit est maintenant attaché dans loadArtisanData ou openArtisanModal
}

// Voir la fiche artisan détaillée
async function viewArtisan(id) {
    try {
        const artisan = await API.getArtisan(id);
        if (!artisan) {
            alert('Artisan non trouvé');
            return;
        }

        const initials = (artisan.nom_societe?.[0] || '') + (artisan.nom_societe?.[1] || '');
        
        document.getElementById('modal-title').textContent = 'Fiche Artisan';
        document.getElementById('modal-body').innerHTML = `
            <div class="client-profile-view">
                <div class="client-profile-header">
                    <div class="client-avatar-large">
                        <span>${initials.toUpperCase() || '🔧'}</span>
                    </div>
                    <div class="client-profile-info">
                        <h2>${artisan.nom_societe || 'Sans nom'}</h2>
                        <span class="badge badge-en_cours">${artisan.metier || 'Artisan'}</span>
                    </div>
                </div>
                
                <div class="client-profile-content">
                    <div class="info-section">
                        <h3>📞 Contact</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Téléphone</label>
                                <p>${artisan.telephone || 'Non renseigné'}</p>
                            </div>
                            <div class="info-item">
                                <label>Email</label>
                                <p>${artisan.email || 'Non renseigné'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h3>📊 Informations</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Métier</label>
                                <p>${artisan.metier || 'Non renseigné'}</p>
                            </div>
                            <div class="info-item">
                                <label>Zone d'intervention</label>
                                <p>${artisan.zone_intervention || 'Non renseigné'}</p>
                            </div>
                            <div class="info-item">
                                <label>Adresse</label>
                                <p>${artisan.adresse || 'Non renseigné'}</p>
                            </div>
                            <div class="info-item">
                                <label>Date de création</label>
                                <p>${artisan.date_creation ? formatDate(artisan.date_creation) : 'Non renseigné'}</p>
                            </div>
                        </div>
                    </div>
                    
                    ${artisan.notes ? `
                    <div class="info-section">
                        <h3>📝 Notes</h3>
                        <div class="notes-content">
                            <p>${artisan.notes}</p>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="info-section">
                        <h3>🔗 Liens</h3>
                        <div class="links-section">
                            <button class="btn btn-sm btn-primary" onclick="closeModal(); navigateToPage('devis'); setTimeout(() => { const filter = document.getElementById('devis-filter-artisan'); if (filter) filter.value = '${artisan.id}'; loadDevis(); }, 100);">
                                Voir les devis
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Fermer</button>
                    <button type="button" class="btn btn-primary" onclick="closeModal(); editArtisan(${artisan.id})">Modifier</button>
                </div>
            </div>
        `;
        
        openModalWithScroll();
    } catch (error) {
        console.error('Erreur viewArtisan:', error);
        alert('Erreur lors du chargement de la fiche artisan');
    }
}

async function deleteArtisan(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet artisan ?')) {
        try {
            await API.deleteArtisan(id);
            loadArtisans();
            // Rafraîchir le dashboard si on est sur la page dashboard
            if (currentPage === 'dashboard') {
                loadDashboard();
            }
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    }
}

// Modals - Devis
function openDevisModal(id = null) {
    editingId = id;
    const title = id ? 'Modifier le devis' : 'Nouveau devis';
    document.getElementById('modal-title').textContent = title;
    
    if (id) {
        loadDevisData(id);
    } else {
        Promise.all([loadProjetsForSelect(), loadArtisansForSelect()]).then(async () => {
            document.getElementById('modal-body').innerHTML = getDevisForm();
            await loadUtilisateursForSelect('devis-commercial-select');
            setTimeout(() => {
                attachDevisFormSubmit();
            }, 100);
        });
    }
    
    openModalWithScroll();
}

async function loadDevisData(id) {
    try {
        const devis = await API.getDevi(id);
        await Promise.all([loadProjetsForSelect(), loadArtisansForSelect()]);
        document.getElementById('modal-body').innerHTML = getDevisForm(devis);
        await loadUtilisateursForSelect('devis-commercial-select', devis?.utilisateur_id);
        setTimeout(() => {
            attachDevisFormSubmit();
        }, 100);
    } catch (error) {
        alert('Erreur lors du chargement du devis');
    }
}

function attachDevisFormSubmit() {
    const form = document.getElementById('devis-form');
    if (form) {
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        document.getElementById('devis-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            // Convertir montant et commission en nombres
            if (data.montant) data.montant = parseFloat(data.montant);
            if (data.commission) data.commission = parseFloat(data.commission);
            
            try {
                if (editingId) {
                    await API.updateDevis(editingId, data);
                } else {
                    await API.createDevis(data);
                }
                closeModal();
                loadDevis();
                // Rafraîchir le dashboard si on est sur la page dashboard
                if (currentPage === 'dashboard') {
                    loadDashboard();
                }
            } catch (error) {
                alert('Erreur: ' + error.message);
            }
        });
    }
}

async function loadProjetsForSelect() {
    try {
        const projets = await API.getProjets();
        window.projetsList = projets;
    } catch (error) {
        console.error('Error loading projets:', error);
    }
}

async function loadArtisansForSelect() {
    try {
        const artisans = await API.getArtisans();
        window.artisansList = artisans;
    } catch (error) {
        console.error('Error loading artisans:', error);
    }
}

function getDevisForm(devis = null) {
    const projetsOptions = (window.projetsList || []).map(p => 
        `<option value="${p.id}" ${devis?.projet_id == p.id ? 'selected' : ''}>${p.titre} - ${p.client_prenom} ${p.client_nom}</option>`
    ).join('');
    
    const artisansOptions = (window.artisansList || []).map(a => 
        `<option value="${a.id}" ${devis?.artisan_id == a.id ? 'selected' : ''}>${a.nom_societe} - ${a.metier}</option>`
    ).join('');
    
    return `
        <form id="devis-form">
            <div class="form-group">
                <label>Projet *</label>
                <select name="projet_id" required>
                    <option value="">Sélectionner un projet</option>
                    ${projetsOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Artisan *</label>
                <select name="artisan_id" required>
                    <option value="">Sélectionner un artisan</option>
                    ${artisansOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Numéro</label>
                <input type="text" name="numero" value="${devis?.numero || ''}">
            </div>
            <div class="form-group">
                <label>Montant (€) *</label>
                <input type="number" step="0.01" name="montant" value="${devis?.montant || ''}" required>
            </div>
            <div class="form-group">
                <label>Commission (€)</label>
                <input type="number" step="0.01" name="commission" value="${devis?.commission || ''}">
            </div>
            <div class="form-group">
                <label>Date du devis *</label>
                <input type="date" name="date_devis" value="${devis?.date_devis || ''}" required>
            </div>
            <div class="form-group">
                <label>Date limite</label>
                <input type="date" name="date_limite" value="${devis?.date_limite || ''}">
            </div>
            <div class="form-group">
                <label>Statut</label>
                <select name="statut" required>
                    <option value="envoye" ${devis?.statut === 'envoye' ? 'selected' : ''}>Envoyé</option>
                    <option value="accepte" ${devis?.statut === 'accepte' ? 'selected' : ''}>Accepté</option>
                    <option value="refuse" ${devis?.statut === 'refuse' ? 'selected' : ''}>Refusé</option>
                </select>
            </div>
            <div class="form-group">
                <label>Commercial assigné</label>
                <select name="utilisateur_id" id="devis-commercial-select">
                    <option value="">Non assigné</option>
                </select>
            </div>
            <div class="form-group">
                <label>Notes</label>
                <textarea name="notes">${devis?.notes || ''}</textarea>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Annuler</button>
                <button type="submit" class="btn btn-primary">Enregistrer</button>
            </div>
        </form>
    `;
}

async function editDevis(id) {
    openDevisModal(id);
    // L'événement submit est maintenant attaché dans loadDevisData ou openDevisModal
}

// Voir la fiche devis détaillée
async function viewDevis(id) {
    try {
        const devis = await API.getDevi(id);
        if (!devis) {
            alert('Devis non trouvé');
            return;
        }

        document.getElementById('modal-title').textContent = 'Fiche Devis';
        document.getElementById('modal-body').innerHTML = `
            <div class="client-profile-view">
                <div class="client-profile-header">
                    <div class="client-avatar-large">
                        <span>📄</span>
                    </div>
                    <div class="client-profile-info">
                        <h2>Devis ${devis.numero || 'N°' + devis.id}</h2>
                        <span class="badge badge-${devis.statut}">${formatStatut(devis.statut)}</span>
                    </div>
                </div>
                
                <div class="client-profile-content">
                    <div class="info-section">
                        <h3>👤 Informations générales</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Client</label>
                                <p>${devis.client_prenom || ''} ${devis.client_nom || ''}</p>
                            </div>
                            <div class="info-item">
                                <label>Projet</label>
                                <p>${devis.projet_titre || 'Non renseigné'}</p>
                            </div>
                            <div class="info-item">
                                <label>Artisan</label>
                                <p>${devis.artisan_nom || 'Non renseigné'}</p>
                            </div>
                            <div class="info-item">
                                <label>Commercial assigné</label>
                                <p>${devis.utilisateur_prenom && devis.utilisateur_nom ? `${devis.utilisateur_prenom} ${devis.utilisateur_nom}` : 'Non assigné'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h3>💰 Montants</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Montant du devis</label>
                                <p style="font-size: 20px; font-weight: 700; color: var(--accent-cyan);">${formatCurrency(devis.montant || 0)}</p>
                            </div>
                            <div class="info-item">
                                <label>Commission Alliance Renov</label>
                                <p style="font-size: 18px; font-weight: 600; color: var(--accent-cyan);">${devis.commission ? formatCurrency(devis.commission) : 'Non renseigné'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h3>📅 Dates</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Date du devis</label>
                                <p>${devis.date_devis ? formatDate(devis.date_devis) : 'Non renseigné'}</p>
                            </div>
                            <div class="info-item">
                                <label>Date limite</label>
                                <p>${devis.date_limite ? formatDate(devis.date_limite) : 'Non renseigné'}</p>
                            </div>
                            <div class="info-item">
                                <label>Date de création</label>
                                <p>${devis.date_creation ? formatDate(devis.date_creation) : 'Non renseigné'}</p>
                            </div>
                        </div>
                    </div>
                    
                    ${devis.notes ? `
                    <div class="info-section">
                        <h3>📝 Notes</h3>
                        <div class="notes-content">
                            <p>${devis.notes}</p>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="info-section">
                        <h3>🔗 Liens</h3>
                        <div class="links-section">
                            <button class="btn btn-sm btn-primary" onclick="closeModal(); viewClient(${devis.client_id})" style="margin-right: 10px;">
                                Voir le client
                            </button>
                            <button class="btn btn-sm btn-primary" onclick="closeModal(); viewProjet(${devis.projet_id})">
                                Voir le projet
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Fermer</button>
                    <button type="button" class="btn btn-primary" onclick="closeModal(); editDevis(${devis.id})">Modifier</button>
                </div>
            </div>
        `;
        
        openModalWithScroll();
    } catch (error) {
        console.error('Erreur viewDevis:', error);
        alert('Erreur lors du chargement de la fiche devis');
    }
}

async function deleteDevis(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
        try {
            await API.deleteDevis(id);
            loadDevis();
            // Rafraîchir le dashboard si on est sur la page dashboard
            if (currentPage === 'dashboard') {
                loadDashboard();
            }
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    }
}

function exportDevis() {
    API.exportDevis();
}

// Commerciaux
async function loadCommerciaux() {
    try {
        const filters = {};
        const search = document.getElementById('commercial-search')?.value;
        const role = document.getElementById('commercial-filter-role')?.value;
        
        if (search) filters.search = search;
        if (role) filters.role = role;

        const commerciaux = await API.getUtilisateurs();
        const commerciauxGrid = document.querySelector('.commerciaux-grid');
        
        if (!commerciauxGrid) return;

        // Filtrer les commerciaux si nécessaire
        let filteredCommerciaux = commerciaux;
        if (search) {
            filteredCommerciaux = commerciaux.filter(c => 
                `${c.prenom} ${c.nom}`.toLowerCase().includes(search.toLowerCase()) ||
                c.email.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (role) {
            filteredCommerciaux = filteredCommerciaux.filter(c => c.role === role);
        }

        // Charger les statistiques pour chaque commercial
        const commerciauxWithStats = await Promise.all(
            filteredCommerciaux.map(async (commercial) => {
                try {
                    const stats = await API.getCommercialStats(commercial.id);
                    return { ...commercial, stats };
                } catch (error) {
                    console.error(`Erreur stats pour commercial ${commercial.id}:`, error);
                    return { ...commercial, stats: null };
                }
            })
        );

        commerciauxGrid.innerHTML = commerciauxWithStats.map(commercial => {
            const stats = commercial.stats || {};
            const initials = (commercial.prenom?.[0] || '') + (commercial.nom?.[0] || '');
            
            return `
                <div class="commercial-card" onclick="viewCommercial(${commercial.id})">
                    <div class="commercial-card-header">
                        <div class="commercial-avatar">
                            <span>${initials.toUpperCase()}</span>
                        </div>
                        <div class="commercial-info">
                            <h3>${commercial.prenom} ${commercial.nom}</h3>
                            <p class="commercial-email">${commercial.email}</p>
                            <span class="badge badge-${commercial.role}">${commercial.role === 'admin' ? 'Administrateur' : 'Commercial'}</span>
                        </div>
                    </div>
                    <div class="commercial-stats">
                        <div class="stat-mini">
                            <div class="stat-mini-value">${stats.nb_clients || 0}</div>
                            <div class="stat-mini-label">Clients</div>
                        </div>
                        <div class="stat-mini">
                            <div class="stat-mini-value">${stats.nb_projets || 0}</div>
                            <div class="stat-mini-label">Projets</div>
                        </div>
                        <div class="stat-mini">
                            <div class="stat-mini-value">${stats.nb_devis || 0}</div>
                            <div class="stat-mini-label">Devis</div>
                        </div>
                        <div class="stat-mini highlight">
                            <div class="stat-mini-value">${formatCurrency(stats.commission_totale || 0)}</div>
                            <div class="stat-mini-label">Commission</div>
                        </div>
                    </div>
                    <div class="commercial-performance">
                        <div class="performance-item">
                            <span class="performance-label">Taux de conversion:</span>
                            <span class="performance-value">${stats.taux_conversion || 0}%</span>
                        </div>
                        <div class="performance-item">
                            <span class="performance-label">CA généré:</span>
                            <span class="performance-value">${formatCurrency(stats.montant_total || 0)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Mettre à jour l'état des filtres après le chargement
        const commercialFilterRole = document.getElementById('commercial-filter-role');
        if (commercialFilterRole) {
            updateFilterState('commercial-filter-role', commercialFilterRole.value || '');
        }
    } catch (error) {
        console.error('Error loading commerciaux:', error);
    }
}

// Voir la fiche détaillée d'un commercial
async function viewCommercial(id) {
    try {
        const commercial = await Promise.all([
            API.getUtilisateur(id),
            API.getCommercialClients(id),
            API.getCommercialProjets(id),
            API.getCommercialDevis(id)
        ]);

        const [commercialData, clients, projets, devis] = commercial;
        if (!commercialData) {
            alert('Commercial non trouvé');
            return;
        }

        const stats = commercialData.stats || {};
        const initials = (commercialData.prenom?.[0] || '') + (commercialData.nom?.[0] || '');

        document.getElementById('modal-title').textContent = 'Fiche Commercial';
        document.getElementById('modal-body').innerHTML = `
            <div class="client-profile-view">
                <div class="client-profile-header">
                    <div class="client-avatar-large">
                        <span>${initials.toUpperCase()}</span>
                    </div>
                    <div class="client-profile-info">
                        <h2>${commercialData.prenom} ${commercialData.nom}</h2>
                        <span class="badge badge-${commercialData.role}">${commercialData.role === 'admin' ? 'Administrateur' : 'Commercial'}</span>
                        <p class="commercial-email">${commercialData.email}</p>
                    </div>
                </div>
                
                <div class="client-profile-content">
                    <div class="info-section">
                        <h3>📊 Statistiques globales</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Clients assignés</label>
                                <p style="font-size: 24px; font-weight: 700; color: var(--accent-cyan);">${stats.nb_clients || 0}</p>
                            </div>
                            <div class="info-item">
                                <label>Projets assignés</label>
                                <p style="font-size: 24px; font-weight: 700; color: var(--accent-cyan);">${stats.nb_projets || 0}</p>
                            </div>
                            <div class="info-item">
                                <label>Projets terminés</label>
                                <p style="font-size: 24px; font-weight: 700; color: #4caf50;">${stats.nb_projets_termines || 0}</p>
                            </div>
                            <div class="info-item">
                                <label>Devis créés</label>
                                <p style="font-size: 24px; font-weight: 700; color: var(--accent-cyan);">${stats.nb_devis || 0}</p>
                            </div>
                            <div class="info-item">
                                <label>Devis acceptés</label>
                                <p style="font-size: 24px; font-weight: 700; color: #4caf50;">${stats.nb_devis_acceptes || 0}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h3>💰 Performance financière</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Chiffre d'affaires généré</label>
                                <p style="font-size: 28px; font-weight: 700; color: var(--accent-cyan);">${formatCurrency(stats.montant_total || 0)}</p>
                            </div>
                            <div class="info-item">
                                <label>Commission totale</label>
                                <p style="font-size: 28px; font-weight: 700; color: #4caf50;">${formatCurrency(stats.commission_totale || 0)}</p>
                            </div>
                            <div class="info-item">
                                <label>Taux de conversion</label>
                                <p style="font-size: 24px; font-weight: 700; color: var(--accent-pink);">${stats.taux_conversion || 0}%</p>
                            </div>
                            <div class="info-item">
                                <label>Projets en cours</label>
                                <p style="font-size: 24px; font-weight: 700; color: var(--accent-cyan);">${stats.nb_projets_en_cours || 0}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h3>👥 Clients assignés (${clients.length})</h3>
                        <div class="commercial-entities-list">
                            ${clients.length > 0 ? clients.slice(0, 5).map(client => `
                                <div class="entity-item clickable" onclick="closeModal(); viewClient(${client.id})">
                                    <div class="entity-name">${client.prenom} ${client.nom}</div>
                                    <div class="entity-meta">
                                        <span class="badge badge-${client.statut}">${formatStatut(client.statut)}</span>
                                        <span>${client.nb_projets || 0} projet(s)</span>
                                    </div>
                                </div>
                            `).join('') : '<p style="color: var(--text-secondary);">Aucun client assigné</p>'}
                            ${clients.length > 5 ? `<p style="color: var(--text-secondary); margin-top: 10px;">... et ${clients.length - 5} autre(s) client(s)</p>` : ''}
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h3>🏗️ Projets assignés (${projets.length})</h3>
                        <div class="commercial-entities-list">
                            ${projets.length > 0 ? projets.slice(0, 5).map(projet => `
                                <div class="entity-item clickable" onclick="closeModal(); viewProjet(${projet.id})">
                                    <div class="entity-name">${projet.titre}</div>
                                    <div class="entity-meta">
                                        <span class="badge badge-${projet.statut}">${formatStatut(projet.statut)}</span>
                                        <span>${projet.client_prenom} ${projet.client_nom}</span>
                                    </div>
                                </div>
                            `).join('') : '<p style="color: var(--text-secondary);">Aucun projet assigné</p>'}
                            ${projets.length > 5 ? `<p style="color: var(--text-secondary); margin-top: 10px;">... et ${projets.length - 5} autre(s) projet(s)</p>` : ''}
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h3>📄 Devis créés (${devis.length})</h3>
                        <div class="commercial-entities-list">
                            ${devis.length > 0 ? devis.slice(0, 5).map(d => `
                                <div class="entity-item clickable" onclick="closeModal(); viewDevis(${d.id})">
                                    <div class="entity-name">Devis ${d.numero || 'N°' + d.id}</div>
                                    <div class="entity-meta">
                                        <span class="badge badge-${d.statut}">${formatStatut(d.statut)}</span>
                                        <span>${formatCurrency(d.montant)}</span>
                                    </div>
                                </div>
                            `).join('') : '<p style="color: var(--text-secondary);">Aucun devis créé</p>'}
                            ${devis.length > 5 ? `<p style="color: var(--text-secondary); margin-top: 10px;">... et ${devis.length - 5} autre(s) devis</p>` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Fermer</button>
                    <button type="button" class="btn btn-primary" onclick="closeModal(); navigateToPage('clients'); document.getElementById('commercial-search')?.value = '${commercialData.prenom} ${commercialData.nom}'; loadClients();">
                        Voir tous les clients
                    </button>
                </div>
            </div>
        `;
        
        openModalWithScroll();
    } catch (error) {
        console.error('Erreur viewCommercial:', error);
        alert('Erreur lors du chargement de la fiche commercial');
    }
}

// Modals - Relances
function openRelanceModal(id = null) {
    editingId = id;
    const title = id ? 'Modifier la relance' : 'Nouvelle relance';
    document.getElementById('modal-title').textContent = title;
    
    if (id) {
        loadRelanceData(id);
    } else {
        Promise.all([loadClientsForSelect(), loadProjetsForSelect()]).then(() => {
            document.getElementById('modal-body').innerHTML = getRelanceForm();
            setTimeout(() => {
                attachRelanceFormSubmit();
            }, 100);
        });
    }
    
    openModalWithScroll();
}

async function loadRelanceData(id) {
    try {
        const relance = await API.getRelance(id);
        await Promise.all([loadClientsForSelect(), loadProjetsForSelect()]);
        document.getElementById('modal-body').innerHTML = getRelanceForm(relance);
        setTimeout(() => {
            attachRelanceFormSubmit();
        }, 100);
    } catch (error) {
        alert('Erreur lors du chargement de la relance');
    }
}

function attachRelanceFormSubmit() {
    const form = document.getElementById('relance-form');
    if (form) {
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        document.getElementById('relance-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                if (editingId) {
                    await API.updateRelance(editingId, data);
                } else {
                    await API.createRelance(data);
                }
                closeModal();
                loadRelances();
                // Rafraîchir le dashboard si on est sur la page dashboard
                if (currentPage === 'dashboard') {
                    loadDashboard();
                }
            } catch (error) {
                alert('Erreur: ' + error.message);
            }
        });
    }
}

function getRelanceForm(relance = null) {
    const clientsOptions = (window.clientsList || []).map(c => 
        `<option value="${c.id}" ${relance?.client_id == c.id ? 'selected' : ''}>${c.prenom} ${c.nom}</option>`
    ).join('');
    
    const projetsOptions = (window.projetsList || []).map(p => 
        `<option value="${p.id}" ${relance?.projet_id == p.id ? 'selected' : ''}>${p.titre}</option>`
    ).join('');
    
    return `
        <form id="relance-form">
            <div class="form-group">
                <label>Type *</label>
                <select name="type" required>
                    <option value="appel" ${relance?.type === 'appel' ? 'selected' : ''}>Appel</option>
                    <option value="rdv" ${relance?.type === 'rdv' ? 'selected' : ''}>Rendez-vous</option>
                    <option value="relance_devis" ${relance?.type === 'relance_devis' ? 'selected' : ''}>Relance devis</option>
                </select>
            </div>
            <div class="form-group">
                <label>Titre *</label>
                <input type="text" name="titre" value="${relance?.titre || ''}" required>
            </div>
            <div class="form-group">
                <label>Client</label>
                <select name="client_id">
                    <option value="">Sélectionner un client</option>
                    ${clientsOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Projet</label>
                <select name="projet_id">
                    <option value="">Sélectionner un projet</option>
                    ${projetsOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Date programmée *</label>
                <input type="datetime-local" name="date_programmee" value="${relance?.date_programmee ? formatDateTimeLocal(relance.date_programmee) : ''}" required>
            </div>
            <div class="form-group">
                <label>Statut</label>
                <select name="statut" required>
                    <option value="a_faire" ${relance?.statut === 'a_faire' ? 'selected' : ''}>À faire</option>
                    <option value="fait" ${relance?.statut === 'fait' ? 'selected' : ''}>Fait</option>
                </select>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description">${relance?.description || ''}</textarea>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Annuler</button>
                <button type="submit" class="btn btn-primary">Enregistrer</button>
            </div>
        </form>
    `;
}

// Voir la fiche relance détaillée
async function viewRelance(id) {
    try {
        const relance = await API.getRelance(id);
        if (!relance) {
            alert('Relance non trouvée');
            return;
        }

        document.getElementById('modal-title').textContent = 'Fiche Relance';
        document.getElementById('modal-body').innerHTML = `
            <div class="client-profile-view">
                <div class="client-profile-header">
                    <div class="client-avatar-large">
                        <span>📞</span>
                    </div>
                    <div class="client-profile-info">
                        <h2>${relance.titre || 'Sans titre'}</h2>
                        <span class="badge badge-${relance.statut}">${formatStatut(relance.statut)}</span>
                    </div>
                </div>
                
                <div class="client-profile-content">
                    <div class="info-section">
                        <h3>📋 Informations générales</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Type</label>
                                <p>${formatTypeRelance(relance.type)}</p>
                            </div>
                            <div class="info-item">
                                <label>Date programmée</label>
                                <p>${formatDateTime(relance.date_programmee)}</p>
                            </div>
                            <div class="info-item">
                                <label>Statut</label>
                                <p><span class="badge badge-${relance.statut}">${formatStatut(relance.statut)}</span></p>
                            </div>
                        </div>
                    </div>
                    
                    ${relance.client_id ? `
                    <div class="info-section">
                        <h3>👤 Client</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Client</label>
                                <p>${relance.client_prenom || ''} ${relance.client_nom || ''}</p>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    
                    ${relance.projet_id ? `
                    <div class="info-section">
                        <h3>🏗️ Projet</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Projet</label>
                                <p>${relance.projet_titre || '-'}</p>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    
                    ${relance.description ? `
                    <div class="info-section">
                        <h3>📝 Description</h3>
                        <div class="notes-content">
                            <p>${relance.description}</p>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="info-section">
                        <h3>🔗 Liens</h3>
                        <div class="links-section">
                            ${relance.client_id ? `<button class="btn btn-sm btn-primary" onclick="closeModal(); viewClient(${relance.client_id})" style="margin-right: 10px;">Voir le client</button>` : ''}
                            ${relance.projet_id ? `<button class="btn btn-sm btn-primary" onclick="closeModal(); viewProjet(${relance.projet_id})">Voir le projet</button>` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Fermer</button>
                    <button type="button" class="btn btn-primary" onclick="closeModal(); editRelance(${relance.id})">Modifier</button>
                </div>
            </div>
        `;
        
        openModalWithScroll();
    } catch (error) {
        console.error('Erreur viewRelance:', error);
        alert('Erreur lors du chargement de la fiche relance');
    }
}

async function editRelance(id) {
    openRelanceModal(id);
    // L'événement submit est maintenant attaché dans loadRelanceData ou openRelanceModal
}

async function deleteRelance(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette relance ?')) {
        try {
            await API.deleteRelance(id);
            loadRelances();
            // Rafraîchir le dashboard si on est sur la page dashboard
            if (currentPage === 'dashboard') {
                loadDashboard();
            }
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    }
}

// Utilitaires
function closeModal() {
    const modalBody = document.getElementById('modal-body');
    if (modalBody) {
        modalBody.scrollTop = 0;
    }
    document.getElementById('modal-overlay').classList.remove('active');
    editingId = null;
    // Vider le contenu du modal pour éviter les conflits
    document.getElementById('modal-body').innerHTML = '';
}

// Fonction helper pour ouvrir un modal avec scroll en haut
function openModalWithScroll() {
    const modalBody = document.getElementById('modal-body');
    if (modalBody) {
        setTimeout(() => {
            modalBody.scrollTop = 0;
        }, 50);
    }
    document.getElementById('modal-overlay').classList.add('active');
}

// Fonction helper pour filtrer les projets par client
function filterProjetsByClient(clientId) {
    const filterSelect = document.getElementById('projet-filter-client');
    if (filterSelect) {
        filterSelect.value = clientId;
        loadProjets();
    } else {
        // Si le select n'existe pas encore, attendre un peu puis réessayer
        setTimeout(() => {
            const filterSelectRetry = document.getElementById('projet-filter-client');
            if (filterSelectRetry) {
                filterSelectRetry.value = clientId;
                loadProjets();
            }
        }, 100);
    }
}

// Afficher les projets d'un client dans une modal
async function viewClientProjets(clientId, clientName) {
    try {
        const projets = await API.getProjets({ client_id: clientId });
        
        document.getElementById('modal-title').textContent = `Projets de ${clientName}`;
        document.getElementById('modal-body').innerHTML = `
            <div class="client-projets-view">
                <div class="projets-list-modal">
                    ${projets.length > 0 ? `
                        <table class="data-table" style="width: 100%; margin-top: 20px;">
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>Type travaux</th>
                                    <th>Budget</th>
                                    <th>Date début</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${projets.map(projet => `
                                    <tr>
                                        <td>${projet.titre || '-'}</td>
                                        <td>${projet.type_travaux || '-'}</td>
                                        <td>${projet.budget_estime ? formatCurrency(projet.budget_estime) : '-'}</td>
                                        <td>${projet.date_debut ? formatDate(projet.date_debut) : '-'}</td>
                                        <td><span class="badge badge-${projet.statut}">${formatStatut(projet.statut)}</span></td>
                                        <td class="actions">
                                            <button class="btn btn-sm btn-info" onclick="closeModal(); viewProjet(${projet.id})" title="Voir la fiche">👁️</button>
                                            <button class="btn btn-sm btn-primary" onclick="closeModal(); editProjet(${projet.id})">Éditer</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : `
                        <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                            <p style="font-size: 18px; margin-bottom: 10px;">Aucun projet pour ce client</p>
                            <button class="btn btn-primary" onclick="closeModal(); openProjetModal(); document.getElementById('projet-client-select').value = '${clientId}';">
                                Créer un projet
                            </button>
                        </div>
                    `}
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Fermer</button>
                ${projets.length > 0 ? `<button type="button" class="btn btn-primary" onclick="closeModal(); navigateToPage('projets'); filterProjetsByClient(${clientId});">Voir tous les projets</button>` : ''}
            </div>
        `;
        
        openModalWithScroll();
    } catch (error) {
        console.error('Erreur viewClientProjets:', error);
        alert('Erreur lors du chargement des projets du client');
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatDate(date) {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
}

function formatDateTime(date) {
    if (!date) return '-';
    return new Date(date).toLocaleString('fr-FR');
}

function formatDateTimeLocal(date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatStatut(statut) {
    const statuts = {
        'prospect': 'Prospect',
        'en_cours': 'En cours',
        'signe': 'Signé',
        'a_etudier': 'À étudier',
        'termine': 'Terminé',
        'envoye': 'Envoyé',
        'accepte': 'Accepté',
        'refuse': 'Refusé',
        'a_faire': 'À faire',
        'fait': 'Fait'
    };
    return statuts[statut] || statut;
}

function formatTypeRelance(type) {
    const types = {
        'appel': 'Appel',
        'rdv': 'Rendez-vous',
        'relance_devis': 'Relance devis'
    };
    return types[type] || type;
}

// Gestion des états des filtres
function updateFilterState(filterId, value) {
    const select = document.getElementById(filterId);
    if (!select) {
        console.warn(`Filtre ${filterId} non trouvé`);
        return;
    }
    
    // Retirer d'abord la classe pour éviter les conflits
    select.classList.remove('filter-active');
    
    // Ajouter la classe seulement si une valeur est sélectionnée
    // Convertir en string pour être sûr de la comparaison
    const stringValue = String(value || '').trim();
    if (stringValue && stringValue !== '' && stringValue !== 'null' && stringValue !== 'undefined') {
        select.classList.add('filter-active');
    }
}

function updateAllFilterStates() {
    // Mettre à jour tous les filtres existants
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        if (select.value && select.value !== '') {
            select.classList.add('filter-active');
        } else {
            select.classList.remove('filter-active');
        }
    });
}

// Système de tri pour les tableaux
let sortState = {
    table: null,
    column: null,
    direction: 'asc' // 'asc' ou 'desc'
};

function initTableSorting() {
    // Ajouter les écouteurs de clic sur les en-têtes de colonnes
    document.querySelectorAll('.data-table thead th.sortable').forEach(header => {
        header.addEventListener('click', () => {
            const table = header.closest('.data-table');
            // Utiliser l'index réel dans le tableau complet (toutes les colonnes)
            const columnIndex = Array.from(header.parentElement.children).indexOf(header);
            const tableId = table.id || table.closest('.table-container')?.querySelector('table')?.id;
            
            sortTable(tableId, columnIndex, header);
        });
    });
}

function sortTable(tableId, columnIndex, headerElement) {
    const table = document.querySelector(`#${tableId}`);
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    
    const rows = Array.from(tbody.querySelectorAll('tr'));
    if (rows.length === 0) return;
    
    // Déterminer la direction du tri
    const isSameColumn = sortState.table === tableId && sortState.column === columnIndex;
    const direction = isSameColumn && sortState.direction === 'asc' ? 'desc' : 'asc';
    
    // Mettre à jour l'état
    sortState.table = tableId;
    sortState.column = columnIndex;
    sortState.direction = direction;
    
    // Trier les lignes
    rows.sort((a, b) => {
        const aCell = a.children[columnIndex];
        const bCell = b.children[columnIndex];
        
        if (!aCell || !bCell) return 0;
        
        let aValue = aCell.textContent.trim();
        let bValue = bCell.textContent.trim();
        
        // Essayer de convertir en nombre si possible
        const aNum = parseFloat(aValue.replace(/[^\d.,-]/g, '').replace(',', '.'));
        const bNum = parseFloat(bValue.replace(/[^\d.,-]/g, '').replace(',', '.'));
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            aValue = aNum;
            bValue = bNum;
        } else {
            // Comparaison de dates
            const aDate = new Date(aValue);
            const bDate = new Date(bValue);
            if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
                aValue = aDate;
                bValue = bDate;
            }
        }
        
        // Comparaison
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    // Réorganiser les lignes dans le DOM
    rows.forEach(row => tbody.appendChild(row));
    
    // Mettre à jour les indicateurs visuels en utilisant l'élément header directement
    updateSortIndicators(tableId, headerElement, direction);
}

function updateSortIndicators(tableId, headerElement, direction) {
    const table = document.querySelector(`#${tableId}`);
    if (!table) return;
    
    // Retirer tous les indicateurs existants de tous les headers triables
    const allHeaders = table.querySelectorAll('thead th.sortable');
    allHeaders.forEach(header => {
        header.classList.remove('sort-asc', 'sort-desc');
        const existingIcon = header.querySelector('.sort-icon');
        if (existingIcon) {
            existingIcon.remove();
        }
    });
    
    // Ajouter l'indicateur sur le header cliqué
    if (headerElement) {
        headerElement.classList.add(`sort-${direction}`);
        const icon = document.createElement('span');
        icon.className = 'sort-icon';
        icon.textContent = direction === 'asc' ? ' ▲' : ' ▼';
        headerElement.appendChild(icon);
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

