/**
 * Application de gestion des réservations de salles
 */

let salles = [];
let reservations = [];

// Utilitaire pour générer des IDs uniques
function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Système de notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.getElementById('notifications').appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Gestion des onglets
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Gestion des salles
class SalleManager {
    static ajouter(nom, capacite) {
        try {
            if (!nom || nom.trim().length === 0) {
                throw new Error('Le nom de la salle est obligatoire');
            }
            if (!capacite || capacite <= 0) {
                throw new Error('La capacité doit être supérieure à 0');
            }
            
            const salle = {
                id: generateId(),
                nom: nom.trim(),
                capacite: parseInt(capacite)
            };
            
            salles.push(salle);
            this.updateDisplay();
            this.updateSelects();
            
            showNotification(`Salle "${nom}" ajoutée avec succès`, 'success');
            return salle;
        } catch (error) {
            showNotification(error.message, 'error');
            throw error;
        }
    }
    
    static modifier(id, nom, capacite) {
        try {
            const salle = salles.find(s => s.id === id);
            if (!salle) {
                throw new Error('Salle non trouvée');
            }
            
            if (!nom || nom.trim().length === 0) {
                throw new Error('Le nom de la salle est obligatoire');
            }
            if (!capacite || capacite <= 0) {
                throw new Error('La capacité doit être supérieure à 0');
            }
            
            salle.nom = nom.trim();
            salle.capacite = parseInt(capacite);
            
            this.updateDisplay();
            this.updateSelects();
            
            showNotification(`Salle "${nom}" modifiée avec succès`, 'success');
        } catch (error) {
            showNotification(error.message, 'error');
            throw error;
        }
    }
    
    static supprimer(id) {
        const index = salles.findIndex(s => s.id === id);
        if (index === -1) {
            showNotification('Salle non trouvée', 'error');
            return false;
        }
        
        const salle = salles[index];
        
        reservations = reservations.filter(r => r.salleId !== id);
        salles.splice(index, 1);
        
        this.updateDisplay();
        this.updateSelects();
        ReservationManager.updateDisplay();
        
        showNotification(`Salle "${salle.nom}" supprimée avec succès`, 'success');
        return true;
    }
    
    static updateDisplay() {
        const container = document.getElementById('sallesList');
        
        if (salles.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Aucune salle enregistrée</h3>
                    <p>Ajoutez votre première salle pour commencer</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = salles.map(salle => `
            <div class="list-item">
                <div class="list-item-header">
                    <div class="list-item-title">${salle.nom}</div>
                    <div class="list-item-actions">
                        <button class="btn btn-warning btn-small" onclick="openEditSalleModal('${salle.id}')">
                            Modifier
                        </button>
                        <button class="btn btn-danger btn-small" onclick="SalleManager.supprimer('${salle.id}')">
                            Supprimer
                        </button>
                    </div>
                </div>
                <div class="list-item-details">
                    <p><strong>Capacité :</strong> ${salle.capacite} personnes</p>
                    <p><strong>ID :</strong> ${salle.id}</p>
                </div>
            </div>
        `).join('');
    }
    
    static updateSelects() {
        const selects = ['reservationSalle', 'filterSalle'];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            const currentValue = select.value;
            
            // Conserver la première option
            const firstOption = select.querySelector('option');
            select.innerHTML = firstOption.outerHTML;
            
            salles.forEach(salle => {
                const option = document.createElement('option');
                option.value = salle.id;
                option.textContent = `${salle.nom} (${salle.capacite} pers.)`;
                select.appendChild(option);
            });
            
            if (currentValue && salles.find(s => s.id === currentValue)) {
                select.value = currentValue;
            }
        });
    }
}

// Gestion des réservations
class ReservationManager {
    static creer(salleId, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes) {
        try {
            const salle = salles.find(s => s.id === salleId);
            if (!salle) {
                throw new Error('Salle non trouvée');
            }
            
            if (nombrePersonnes > salle.capacite) {
                throw new Error(`La salle ne peut accueillir que ${salle.capacite} personnes maximum`);
            }
            
            const debut = new Date(dateDebut);
            const fin = new Date(dateFin);
            
            if (debut > fin) {
                throw new Error('La date de début doit être antérieure ou égale à la date de fin');
            }
            
            if (heureDebut >= heureFin) {
                throw new Error('L\'heure de début doit être antérieure à l\'heure de fin');
            }
            
            const nouveaureservation = {
                id: generateId(),
                salleId,
                dateDebut: debut,
                dateFin: fin,
                heureDebut,
                heureFin,
                nombrePersonnes: parseInt(nombrePersonnes)
            };
            
            const conflits = this.detecterConflits(nouveaureservation);
            if (conflits.length > 0) {
                throw new Error('La salle est déjà réservée sur cette plage horaire');
            }
            
            reservations.push(nouveaureservation);
            this.updateDisplay();
            
            showNotification('Réservation créée avec succès', 'success');
            return nouveaureservation;
            
        } catch (error) {
            showNotification(error.message, 'error');
            throw error;
        }
    }
    
    static detecterConflits(nouvelle) {
        return reservations.filter(reservation => {
            if (reservation.salleId !== nouvelle.salleId) {
                return false;
            }
            
            const debutExistant = new Date(reservation.dateDebut);
            const finExistant = new Date(reservation.dateFin);
            const debutNouveau = new Date(nouvelle.dateDebut);
            const finNouveau = new Date(nouvelle.dateFin);
            
            if (finNouveau < debutExistant || debutNouveau > finExistant) {
                return false;
            }
            
            if (nouvelle.heureFin <= reservation.heureDebut || nouvelle.heureDebut >= reservation.heureFin) {
                return false;
            }
            
            return true;
        });
    }
    
    static supprimer(id) {
        const index = reservations.findIndex(r => r.id === id);
        if (index === -1) {
            showNotification('Réservation non trouvée', 'error');
            return false;
        }
        
        reservations.splice(index, 1);
        this.updateDisplay();
        
        showNotification('Réservation supprimée avec succès', 'success');
        return true;
    }
    
    static updateDisplay() {
        const container = document.getElementById('reservationsList');
        const dateFilter = document.getElementById('filterDate').value;
        const salleFilter = document.getElementById('filterSalle').value;
        
        let reservationsFiltrees = [...reservations];
        
        // Appliquer les filtres
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            reservationsFiltrees = reservationsFiltrees.filter(r => {
                const debut = new Date(r.dateDebut);
                const fin = new Date(r.dateFin);
                return filterDate >= debut && filterDate <= fin;
            });
        }
        
        if (salleFilter) {
            reservationsFiltrees = reservationsFiltrees.filter(r => r.salleId === salleFilter);
        }
        
        if (reservationsFiltrees.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Aucune réservation trouvée</h3>
                    <p>Aucune réservation ne correspond aux critères sélectionnés</p>
                </div>
            `;
            return;
        }
        
        reservationsFiltrees.sort((a, b) => {
            const dateA = new Date(a.dateDebut);
            const dateB = new Date(b.dateDebut);
            if (dateA.getTime() === dateB.getTime()) {
                return a.heureDebut.localeCompare(b.heureDebut);
            }
            return dateA - dateB;
        });
        
        container.innerHTML = reservationsFiltrees.map(reservation => {
            const salle = salles.find(s => s.id === reservation.salleId);
            const salleNom = salle ? salle.nom : 'Salle supprimée';
            
            return `
                <div class="list-item">
                    <div class="list-item-header">
                        <div class="list-item-title">${salleNom}</div>
                        <div class="list-item-actions">
                            <button class="btn btn-danger btn-small" onclick="ReservationManager.supprimer('${reservation.id}')">
                                Supprimer
                            </button>
                        </div>
                    </div>
                    <div class="list-item-details">
                        <p><strong>Date :</strong> ${this.formatDate(reservation.dateDebut)} ${reservation.dateDebut.getTime() !== reservation.dateFin.getTime() ? ' - ' + this.formatDate(reservation.dateFin) : ''}</p>
                        <p><strong>Horaires :</strong> ${reservation.heureDebut} - ${reservation.heureFin}</p>
                        <p><strong>Participants :</strong> ${reservation.nombrePersonnes} personnes</p>
                        <p><strong>ID :</strong> ${reservation.id}</p>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    static formatDate(date) {
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    static getReservationsForDate(date) {
        const filterDate = new Date(date);
        return reservations.filter(r => {
            const debut = new Date(r.dateDebut);
            const fin = new Date(r.dateFin);
            return filterDate >= debut && filterDate <= fin;
        });
    }
}

// Gestion des modales
function openEditSalleModal(salleId) {
    const salle = salles.find(s => s.id === salleId);
    if (!salle) return;
    
    document.getElementById('editSalleId').value = salle.id;
    document.getElementById('editSalleNom').value = salle.nom;
    document.getElementById('editSalleCapacite').value = salle.capacite;
    
    document.getElementById('editSalleModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('editSalleModal').style.display = 'none';
}

// Gestionnaires d'événements
function initEventListeners() {
    // Formulaire d'ajout de salle
    document.getElementById('salleForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nom = document.getElementById('salleNom').value;
        const capacite = document.getElementById('salleCapacite').value;
        
        try {
            SalleManager.ajouter(nom, capacite);
            e.target.reset();
        } catch (error) {
        }
    });
    
    // Formulaire de modification de salle
    document.getElementById('editSalleForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('editSalleId').value;
        const nom = document.getElementById('editSalleNom').value;
        const capacite = document.getElementById('editSalleCapacite').value;
        
        try {
            SalleManager.modifier(id, nom, capacite);
            closeModal();
        } catch (error) {
        }
    });
    
    // Formulaire de réservation
    document.getElementById('reservationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const salleId = document.getElementById('reservationSalle').value;
        const dateDebut = document.getElementById('reservationDateDebut').value;
        const dateFin = document.getElementById('reservationDateFin').value;
        const heureDebut = document.getElementById('reservationHeureDebut').value;
        const heureFin = document.getElementById('reservationHeureFin').value;
        const nombrePersonnes = document.getElementById('reservationNombrePersonnes').value;
        
        try {
            ReservationManager.creer(salleId, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes);
            e.target.reset();
        } catch (error) {
        }
    });
    
    // Filtres des réservations
    document.getElementById('filterDate').addEventListener('change', () => {
        ReservationManager.updateDisplay();
    });
    
    document.getElementById('filterSalle').addEventListener('change', () => {
        ReservationManager.updateDisplay();
    });
    
    document.getElementById('clearFilters').addEventListener('click', () => {
        document.getElementById('filterDate').value = '';
        document.getElementById('filterSalle').value = '';
        ReservationManager.updateDisplay();
    });
    
    // Fermeture de modal
    document.querySelector('.close').addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('editSalleModal');
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Données de démonstration
function loadDemoData() {
    SalleManager.ajouter('Salle de conférence A', 20);
    SalleManager.ajouter('Salle de réunion B', 8);
    SalleManager.ajouter('Salle de créativité C', 12);
    SalleManager.ajouter('Bureau partagé D', 4);

    const aujourd_hui = new Date().toISOString().split('T')[0];
    const demain = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    if (salles.length > 0) {
        ReservationManager.creer(salles[0].id, aujourd_hui, aujourd_hui, '09:00', '11:00', 15);
        ReservationManager.creer(salles[1].id, aujourd_hui, aujourd_hui, '14:00', '16:00', 6);
        ReservationManager.creer(salles[0].id, demain, demain, '10:00', '12:00', 18);
    }
}

// Sauvegarde et chargement des données
function saveData() {
    localStorage.setItem('salles', JSON.stringify(salles));
    localStorage.setItem('reservations', JSON.stringify(reservations.map(r => ({
        ...r,
        dateDebut: r.dateDebut.toISOString(),
        dateFin: r.dateFin.toISOString()
    }))));
}

function loadData() {
    const savedSalles = localStorage.getItem('salles');
    const savedReservations = localStorage.getItem('reservations');
    
    if (savedSalles) {
        salles = JSON.parse(savedSalles);
    }
    
    if (savedReservations) {
        reservations = JSON.parse(savedReservations).map(r => ({
            ...r,
            dateDebut: new Date(r.dateDebut),
            dateFin: new Date(r.dateFin)
        }));
    }

    if (salles.length === 0 && reservations.length === 0) {
        loadDemoData();
    }
}

// Sauvegarde automatique
function setupAutoSave() {
    const originalPush = Array.prototype.push;
    const originalSplice = Array.prototype.splice;
    
    setInterval(() => {
        saveData();
    }, 5000);
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initEventListeners();
    loadData();
    setupAutoSave();
    
    SalleManager.updateDisplay();
    SalleManager.updateSelects();
    ReservationManager.updateDisplay();
    
    showNotification('Application chargée avec succès', 'success');
});

// Rendre les fonctions globales accessibles
window.SalleManager = SalleManager;
window.ReservationManager = ReservationManager;
window.openEditSalleModal = openEditSalleModal;
window.closeModal = closeModal;
