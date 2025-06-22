/**
 * Service de réservation - Logique métier pour la gestion des réservations
 * @author BUFFET Evan
 */

const Salle = require('../models/Salle');
const Reservation = require('../models/Reservation');

class ReservationService {
  constructor() {
    this.salles = [];
    this.reservations = [];
  }

  // Gestion des salles
  ajouterSalle(nom, capacite) {
    const salle = new Salle(nom, capacite);
    this.salles.push(salle);
    return salle;
  }

  modifierSalle(salleId, nouveauNom, nouvelleCapacite) {
    const salle = this.salles.find(s => s.id === salleId);
    if (!salle) {
      throw new Error('Salle non trouvée');
    }
    
    salle.modifierNom(nouveauNom);
    salle.modifierCapacite(nouvelleCapacite);
    return salle;
  }

  supprimerSalle(salleId) {
    const index = this.salles.findIndex(s => s.id === salleId);
    if (index === -1) {
      return false;
    }
    
    // Supprimer aussi toutes les réservations de cette salle
    this.reservations = this.reservations.filter(r => r.salleId !== salleId);
    this.salles.splice(index, 1);
    return true;
  }

  getSalles() {
    return this.salles;
  }

  // Gestion des réservations
  creerReservation(salleId, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes) {
    // Vérifier que la salle existe
    const salle = this.salles.find(s => s.id === salleId);
    if (!salle) {
      throw new Error('Salle non trouvée');
    }

    // Vérifier la capacité
    if (nombrePersonnes > salle.capacite) {
      throw new Error(`La salle ne peut accueillir que ${salle.capacite} personnes maximum`);
    }

    // Créer la réservation temporaire pour validation
    const nouvelleReservation = new Reservation(salleId, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes);

    // Vérifier les conflits avec les réservations existantes
    const conflit = this.reservations.find(reservation => 
      nouvelleReservation.chevaucheAvec(reservation)
    );

    if (conflit) {
      throw new Error('La salle est déjà réservée sur cette plage horaire');
    }

    this.reservations.push(nouvelleReservation);
    return nouvelleReservation;
  }

  supprimerReservation(reservationId) {
    const index = this.reservations.findIndex(r => r.id === reservationId);
    if (index === -1) {
      return false;
    }
    
    this.reservations.splice(index, 1);
    return true;
  }

  getReservations() {
    return this.reservations;
  }

  getReservationsParJour(date) {
    return this.reservations.filter(reservation => {
      const dateReservation = reservation.dateDebut;
      return dateReservation.toDateString() === date.toDateString();
    });
  }

  getReservationsParSalle(salleId) {
    return this.reservations.filter(reservation => reservation.salleId === salleId);
  }
}

module.exports = ReservationService;
