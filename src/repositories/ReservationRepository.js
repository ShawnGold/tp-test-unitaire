/**
 * Repository pour les réservations - Gestion de la persistance
 * @author BUFFET Evan
 */

class ReservationRepository {
  constructor() {
    this.reservations = new Map();
  }

  /**
   * Sauvegarde une réservation
   * @param {Reservation} reservation - La réservation à sauvegarder
   * @returns {Reservation} La réservation sauvegardée
   */
  sauvegarder(reservation) {
    this.reservations.set(reservation.id, { ...reservation.getInfos() });
    return reservation;
  }

  /**
   * Trouve une réservation par son identifiant
   * @param {string} id - L'identifiant de la réservation
   * @returns {Object|null} Les données de la réservation ou null
   */
  trouverParId(id) {
    return this.reservations.get(id) || null;
  }

  /**
   * Trouve toutes les réservations
   * @returns {Array<Object>} Toutes les réservations
   */
  trouverTous() {
    return Array.from(this.reservations.values());
  }

  /**
   * Trouve les réservations pour une salle donnée
   * @param {string} salleId - L'identifiant de la salle
   * @returns {Array<Object>} Les réservations de la salle
   */
  trouverParSalle(salleId) {
    return Array.from(this.reservations.values())
      .filter(reservation => reservation.salleId === salleId);
  }

  /**
   * Trouve les réservations pour une date donnée
   * @param {Date} date - La date recherchée
   * @returns {Array<Object>} Les réservations du jour
   */
  trouverParDate(date) {
    const dateRecherche = new Date(date);
    return Array.from(this.reservations.values())
      .filter(reservation => {
        const dateDebut = new Date(reservation.dateDebut);
        const dateFin = new Date(reservation.dateFin);
        return dateRecherche >= dateDebut && dateRecherche <= dateFin;
      });
  }

  /**
   * Supprime une réservation
   * @param {string} id - L'identifiant de la réservation
   * @returns {boolean} True si supprimée avec succès
   */
  supprimer(id) {
    return this.reservations.delete(id);
  }

  /**
   * Vide toutes les réservations
   */
  viderTous() {
    this.reservations.clear();
  }

  /**
   * Compte le nombre de réservations
   * @returns {number} Le nombre de réservations
   */
  compter() {
    return this.reservations.size;
  }
}

module.exports = ReservationRepository;
