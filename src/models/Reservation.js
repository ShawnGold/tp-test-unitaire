/**
 * Modèle Reservation - Représente une réservation de salle
 * @author BUFFET Evan
 */

const { v4: uuidv4 } = require('uuid');

class Reservation {
  constructor(salleId, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes) {
    // Vérifier que tous les paramètres sont fournis
    if (arguments.length < 6) {
      throw new Error('Tous les paramètres sont obligatoires');
    }

    this.id = uuidv4();
    this._validerDonnees(salleId, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes);
    
    this.salleId = salleId;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.heureDebut = heureDebut;
    this.heureFin = heureFin;
    this.nombrePersonnes = nombrePersonnes;
    this.dateCreation = new Date();
  }

  /**
   * Valide toutes les données de la réservation
   * @param {string} salleId - L'identifiant de la salle
   * @param {string|Date} dateDebut - La date de début
   * @param {string|Date} dateFin - La date de fin
   * @param {string} heureDebut - L'heure de début (format HH:MM)
   * @param {string} heureFin - L'heure de fin (format HH:MM)
   * @param {number} nombrePersonnes - Le nombre de personnes
   */
  _validerDonnees(salleId, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes) {
    this._validerSalleId(salleId);
    this._validerDates(dateDebut, dateFin);
    this._validerHeures(heureDebut, heureFin);
    this._validerNombrePersonnes(nombrePersonnes);
    this._validerPlageHoraire(dateDebut, dateFin, heureDebut, heureFin);
  }

  /**
   * Valide l'identifiant de la salle
   * @param {string} salleId - L'identifiant à valider
   */
  _validerSalleId(salleId) {
    if (!salleId || typeof salleId !== 'string') {
      throw new Error('L\'identifiant de la salle est obligatoire');
    }
  }

  /**
   * Valide les dates
   * @param {string|Date} dateDebut - La date de début
   * @param {string|Date} dateFin - La date de fin
   */
  _validerDates(dateDebut, dateFin) {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    if (isNaN(debut.getTime()) || isNaN(fin.getTime())) {
      throw new Error('Les dates doivent être valides');
    }

    if (debut > fin) {
      throw new Error('La date de début doit être antérieure ou égale à la date de fin');
    }
  }

  /**
   * Valide les heures
   * @param {string} heureDebut - L'heure de début
   * @param {string} heureFin - L'heure de fin
   */
  _validerHeures(heureDebut, heureFin) {
    const formatHeure = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    
    if (!formatHeure.test(heureDebut) || !formatHeure.test(heureFin)) {
      throw new Error('Format d\'heure invalide');
    }
  }

  /**
   * Valide le nombre de personnes
   * @param {number} nombrePersonnes - Le nombre à valider
   */
  _validerNombrePersonnes(nombrePersonnes) {
    if (typeof nombrePersonnes !== 'number' || nombrePersonnes <= 0) {
      throw new Error('Le nombre de personnes doit être supérieur à 0');
    }
  }

  /**
   * Valide que la plage horaire est cohérente
   * @param {string|Date} dateDebut - La date de début
   * @param {string|Date} dateFin - La date de fin
   * @param {string} heureDebut - L'heure de début
   * @param {string} heureFin - L'heure de fin
   */
  _validerPlageHoraire(dateDebut, dateFin, heureDebut, heureFin) {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    
    // Si c'est le même jour, vérifier que l'heure de début est avant l'heure de fin
    if (debut.toDateString() === fin.toDateString()) {
      const [heureD, minuteD] = heureDebut.split(':').map(Number);
      const [heureF, minuteF] = heureFin.split(':').map(Number);
      
      const minutesDebut = heureD * 60 + minuteD;
      const minutesFin = heureF * 60 + minuteF;
      
      if (minutesDebut >= minutesFin) {
        throw new Error('L\'heure de début doit être antérieure à l\'heure de fin');
      }
    }
  }

  /**
   * Vérifie si cette réservation chevauche avec une autre
   * @param {Reservation} autreReservation - L'autre réservation à comparer
   * @returns {boolean} True si les réservations se chevauchent
   */
  chevaucheAvec(autreReservation) {
    // Les réservations doivent être pour la même salle
    if (this.salleId !== autreReservation.salleId) {
      return false;
    }

    // Vérifier le chevauchement des dates
    const dateDebutA = new Date(this.dateDebut);
    const dateFinA = new Date(this.dateFin);
    const dateDebutB = new Date(autreReservation.dateDebut);
    const dateFinB = new Date(autreReservation.dateFin);

    // Pas de chevauchement si les périodes sont complètement séparées
    if (dateFinA < dateDebutB || dateFinB < dateDebutA) {
      return false;
    }

    // Si les dates se chevauchent, vérifier les heures
    return this._chevaucheHeures(autreReservation);
  }

  /**
   * Vérifie le chevauchement des heures
   * @param {Reservation} autreReservation - L'autre réservation
   * @returns {boolean} True si les heures se chevauchent
   */
  _chevaucheHeures(autreReservation) {
    const minutesDebutA = this._convertirHeureEnMinutes(this.heureDebut);
    const minutesFinA = this._convertirHeureEnMinutes(this.heureFin);
    const minutesDebutB = this._convertirHeureEnMinutes(autreReservation.heureDebut);
    const minutesFinB = this._convertirHeureEnMinutes(autreReservation.heureFin);

    return !(minutesFinA <= minutesDebutB || minutesFinB <= minutesDebutA);
  }

  /**
   * Convertit une heure au format HH:MM en minutes
   * @param {string} heure - L'heure à convertir
   * @returns {number} Le nombre de minutes
   */
  _convertirHeureEnMinutes(heure) {
    const [heures, minutes] = heure.split(':').map(Number);
    return heures * 60 + minutes;
  }

  /**
   * Retourne les informations de la réservation
   * @returns {Object} Les informations de la réservation
   */
  getInfos() {
    return {
      id: this.id,
      salleId: this.salleId,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin,
      heureDebut: this.heureDebut,
      heureFin: this.heureFin,
      nombrePersonnes: this.nombrePersonnes
    };
  }
}

module.exports = Reservation;
