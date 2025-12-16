/**
 * API Client
 * Alliance Renov CRM
 */

const API_BASE = '/api';

class API {
    static async request(endpoint, options = {}) {
        const url = API_BASE + endpoint;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            credentials: 'include', // Important pour envoyer les cookies de session
            ...options
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            
            // Vérifier si la réponse est vide ou non-JSON
            const contentType = response.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                if (text) {
                    try {
                        data = JSON.parse(text);
                    } catch {
                        throw new Error(text || 'Erreur serveur');
                    }
                } else {
                    data = {};
                }
            }

            if (!response.ok) {
                throw new Error(data.error || 'Erreur API');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth
    static async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: { email, password }
        });
    }

    static async logout() {
        return this.request('/auth/logout', { method: 'POST' });
    }

    static async checkAuth() {
        return this.request('/auth/check');
    }

    // Clients
    static async getClients(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request('/clients?' + params);
    }

    static async getClient(id) {
        return this.request(`/clients/${id}`);
    }

    static async createClient(data) {
        return this.request('/clients', {
            method: 'POST',
            body: data
        });
    }

    static async updateClient(id, data) {
        return this.request(`/clients/${id}`, {
            method: 'PUT',
            body: data
        });
    }

    static async deleteClient(id) {
        return this.request(`/clients/${id}`, {
            method: 'DELETE'
        });
    }

    static exportClients() {
        window.location.href = API_BASE + '/clients/export';
    }

    // Projets
    static async getProjets(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request('/projets?' + params);
    }

    static async getProjet(id) {
        return this.request(`/projets/${id}`);
    }

    static async createProjet(data) {
        return this.request('/projets', {
            method: 'POST',
            body: data
        });
    }

    static async updateProjet(id, data) {
        return this.request(`/projets/${id}`, {
            method: 'PUT',
            body: data
        });
    }

    static async deleteProjet(id) {
        return this.request(`/projets/${id}`, {
            method: 'DELETE'
        });
    }

    // Artisans
    static async getArtisans(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request('/artisans?' + params);
    }

    static async getArtisan(id) {
        return this.request(`/artisans/${id}`);
    }

    static async createArtisan(data) {
        return this.request('/artisans', {
            method: 'POST',
            body: data
        });
    }

    static async updateArtisan(id, data) {
        return this.request(`/artisans/${id}`, {
            method: 'PUT',
            body: data
        });
    }

    static async deleteArtisan(id) {
        return this.request(`/artisans/${id}`, {
            method: 'DELETE'
        });
    }

    // Devis
    static async getDevis(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request('/devis?' + params);
    }

    static async getDevi(id) {
        return this.request(`/devis/${id}`);
    }

    static async createDevis(data) {
        return this.request('/devis', {
            method: 'POST',
            body: data
        });
    }

    static async updateDevis(id, data) {
        return this.request(`/devis/${id}`, {
            method: 'PUT',
            body: data
        });
    }

    static async deleteDevis(id) {
        return this.request(`/devis/${id}`, {
            method: 'DELETE'
        });
    }

    static exportDevis() {
        window.location.href = API_BASE + '/devis/export';
    }

    // Relances
    static async getRelances(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request('/relances?' + params);
    }

    static async getRelance(id) {
        return this.request(`/relances/${id}`);
    }

    static async createRelance(data) {
        return this.request('/relances', {
            method: 'POST',
            body: data
        });
    }

    static async updateRelance(id, data) {
        return this.request(`/relances/${id}`, {
            method: 'PUT',
            body: data
        });
    }

    static async deleteRelance(id) {
        return this.request(`/relances/${id}`, {
            method: 'DELETE'
        });
    }

    static async getUpcomingRelances(limit = 5) {
        return this.request(`/relances/upcoming?limit=${limit}`);
    }

    // Dashboard
    static async getDashboardStats() {
        return this.request('/dashboard/stats');
    }

    // Utilisateurs (Commerciaux)
    static async getUtilisateurs() {
        return this.request('/utilisateurs');
    }

    static async getUtilisateur(id) {
        return this.request(`/utilisateurs/${id}`);
    }

    static async getCommercialStats(id) {
        return this.request(`/utilisateurs/${id}/stats`);
    }

    static async getCommercialClients(id) {
        return this.request(`/utilisateurs/${id}/clients`);
    }

    static async getCommercialProjets(id) {
        return this.request(`/utilisateurs/${id}/projets`);
    }

    static async getCommercialDevis(id) {
        return this.request(`/utilisateurs/${id}/devis`);
    }
}

