/**
 * Modèle Salle - Représente une salle de réunion
 * @author BUFFET Evan
 */

const { v4: uuidv4 } = require('uuid');

class Salle {
  constructor(nom, capacite) {
    this.id = uuidv4();
    this._validerNom(nom);
    this._validerCapacite(capacite);
    
    this.nom = nom;
    this.capacite = capacite;
  }

  /**
   * Valide le nom de la salle
   * @param {string} nom - Le nom à valider
   * @throws {Error} Si le nom est invalide
   */
  _validerNom(nom) {
    if (!nom || nom.trim().length === 0) {
      throw new Error('Le nom de la salle est obligatoire');
    }
  }

  /**
   * Valide la capacité de la salle
   * @param {number} capacite - La capacité à valider
   * @throws {Error} Si la capacité est invalide
   */
  _validerCapacite(capacite) {
    if (typeof capacite !== 'number') {
      throw new Error('La capacité doit être un nombre');
    }
    if (capacite <= 0) {
      throw new Error('La capacité doit être supérieure à 0');
    }
  }

  /**
   * Modifie le nom de la salle
   * @param {string} nouveauNom - Le nouveau nom
   */
  modifierNom(nouveauNom) {
    this._validerNom(nouveauNom);
    this.nom = nouveauNom;
  }

  /**
   * Modifie la capacité de la salle
   * @param {number} nouvelleCapacite - La nouvelle capacité
   */
  modifierCapacite(nouvelleCapacite) {
    this._validerCapacite(nouvelleCapacite);
    this.capacite = nouvelleCapacite;
  }

  /**
   * Retourne les informations de la salle
   * @returns {Object} Les informations de la salle
   */
  getInfos() {
    return {
      id: this.id,
      nom: this.nom,
      capacite: this.capacite
    };
  }
}

module.exports = Salle;
