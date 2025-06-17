/**
 * Contrôleur pour les réservations - Interface entre utilisateur et services
 * @author BUFFET Evan
 */

const ReservationService = require('../services/ReservationService');

class ReservationController {
  constructor() {
    this.reservationService = new ReservationService();
  }

  /**
   * @param {string} nom 
   * @param {number} capacite 
   * @returns {Object} Résultat de l'opération
   */
  ajouterSalle(nom, capacite) {
    try {
      const salle = this.reservationService.ajouterSalle(nom, capacite);
      return {
        success: true,
        message: `Salle "${nom}" ajoutée avec succès`,
        data: salle.getInfos()
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }

  /**
   * Modifie une salle existante
   * @param {string} salleId - L'identifiant de la salle
   * @param {string} nom - Le nouveau nom
   * @param {number} capacite - La nouvelle capacité
   * @returns {Object} Résultat de l'opération
   */
  modifierSalle(salleId, nom, capacite) {
    try {
      const salle = this.reservationService.modifierSalle(salleId, nom, capacite);
      return {
        success: true,
        message: 'Salle modifiée avec succès',
        data: salle.getInfos()
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }

  /**
   * Supprime une salle
   * @param {string} salleId - L'identifiant de la salle
   * @returns {Object} Résultat de l'opération
   */
  supprimerSalle(salleId) {
    try {
      this.reservationService.supprimerSalle(salleId);
      return {
        success: true,
        message: 'Salle supprimée avec succès',
        data: null
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }

  /**
   * Obtient toutes les salles
   * @returns {Object} Résultat de l'opération
   */
  obtenirToutesSalles() {
    try {
      const salles = this.reservationService.getToutesSalles()
        .map(salle => salle.getInfos());
      return {
        success: true,
        message: 'Salles récupérées avec succès',
        data: salles
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  /**
   * Effectue une réservation
   * @param {string} salleId - L'identifiant de la salle
   * @param {string|Date} dateDebut - La date de début
   * @param {string|Date} dateFin - La date de fin
   * @param {string} heureDebut - L'heure de début
   * @param {string} heureFin - L'heure de fin
   * @param {number} nombrePersonnes - Le nombre de personnes
   * @returns {Object} Résultat de l'opération
   */
  effectuerReservation(salleId, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes) {
    try {
      const reservation = this.reservationService.effectuerReservation(
        salleId, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes
      );
      return {
        success: true,
        message: 'Réservation effectuée avec succès',
        data: reservation.getInfos()
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }

  /**
   * Annule une réservation
   * @param {string} reservationId - L'identifiant de la réservation
   * @returns {Object} Résultat de l'opération
   */
  annulerReservation(reservationId) {
    try {
      this.reservationService.annulerReservation(reservationId);
      return {
        success: true,
        message: 'Réservation annulée avec succès',
        data: null
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }

  /**
   * Obtient les réservations pour un jour donné
   * @param {string|Date} date - La date
   * @returns {Object} Résultat de l'opération
   */
  obtenirReservationsPourJour(date) {
    try {
      const reservations = this.reservationService.getReservationsPourJour(date)
        .map(reservation => reservation.getInfos());
      return {
        success: true,
        message: 'Réservations récupérées avec succès',
        data: reservations
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  /**
   * Obtient les réservations pour une salle donnée
   * @param {string} salleId - L'identifiant de la salle
   * @returns {Object} Résultat de l'opération
   */
  obtenirReservationsPourSalle(salleId) {
    try {
      const reservations = this.reservationService.getReservationsPourSalle(salleId)
        .map(reservation => reservation.getInfos());
      return {
        success: true,
        message: 'Réservations récupérées avec succès',
        data: reservations
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  /**
   * Vérifie la disponibilité d'une salle
   * @param {string} salleId - L'identifiant de la salle
   * @param {string|Date} dateDebut - La date de début
   * @param {string|Date} dateFin - La date de fin
   * @param {string} heureDebut - L'heure de début
   * @param {string} heureFin - L'heure de fin
   * @returns {Object} Résultat de l'opération
   */
  verifierDisponibilite(salleId, dateDebut, dateFin, heureDebut, heureFin) {
    try {
      const disponible = this.reservationService.verifierDisponibilite(
        salleId, dateDebut, dateFin, heureDebut, heureFin
      );
      return {
        success: true,
        message: disponible ? 'Salle disponible' : 'Salle non disponible',
        data: { disponible }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: { disponible: false }
      };
    }
  }
}

module.exports = ReservationController;
