const { setWorldConstructor, Before, After } = require('@cucumber/cucumber');
const ReservationService = require('../../src/services/ReservationService');

class CustomWorld {
  constructor() {
    this.reservationService = null;
    this.salles = new Map();
    this.reservations = new Map();
    this.lastError = null;
    this.lastResult = null;
    this.lastReservation = null;
  }

  // Initialise le service de réservation
  initializeService() {
    this.reservationService = new ReservationService();
  }

  // Ajoute une salle au contexte
  addSalle(nom, capacite) {
    try {
      const salle = this.reservationService.ajouterSalle(nom, capacite);
      this.salles.set(nom, salle);
      return salle;
    } catch (error) {
      this.lastError = error;
      throw error;
    }
  }

  // Récupère une salle par son nom
  getSalle(nom) {
    return this.salles.get(nom);
  }

  // Créer une réservation
  createReservation(salleNom, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes) {
    try {
      const salle = this.getSalle(salleNom);
      if (!salle) {
        throw new Error(`Salle "${salleNom}" non trouvée`);
      }

      const reservation = this.reservationService.creerReservation(
        salle.id,
        new Date(dateDebut),
        new Date(dateFin),
        heureDebut,
        heureFin,
        nombrePersonnes
      );
      
      this.reservations.set(reservation.id, reservation);
      this.lastReservation = reservation;
      return reservation;
    } catch (error) {
      this.lastError = error;
      throw error;
    }
  }

  // Nettoie le contexte
  cleanup() {
    this.reservationService = null;
    this.salles.clear();
    this.reservations.clear();
    this.lastError = null;
    this.lastResult = null;
    this.lastReservation = null;
  }
}

setWorldConstructor(CustomWorld);

// Hooks
Before(function () {
  this.initializeService();
});

After(function () {
  this.cleanup();
});
