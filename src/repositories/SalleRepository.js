/**
 * Repository pour les salles - Gestion de la persistance
 * @author BUFFET Evan
 */

class SalleRepository {
  constructor() {
    this.salles = new Map();
  }

  /**
   * Sauvegarde une salle
   * @param {Salle} salle - La salle à sauvegarder
   * @returns {Salle} La salle sauvegardée
   */
  sauvegarder(salle) {
    this.salles.set(salle.id, { ...salle.getInfos() });
    return salle;
  }

  /**
   * Trouve une salle par son identifiant
   * @param {string} id - L'identifiant de la salle
   * @returns {Object|null} Les données de la salle ou null
   */
  trouverParId(id) {
    return this.salles.get(id) || null;
  }

  /**
   * Trouve toutes les salles
   * @returns {Array<Object>} Toutes les salles
   */
  trouverTous() {
    return Array.from(this.salles.values());
  }

  /**
   * Supprime une salle
   * @param {string} id - L'identifiant de la salle
   * @returns {boolean} True si supprimée avec succès
   */
  supprimer(id) {
    return this.salles.delete(id);
  }

  /**
   * Vide toutes les salles
   */
  viderTous() {
    this.salles.clear();
  }

  /**
   * Compte le nombre de salles
   * @returns {number} Le nombre de salles
   */
  compter() {
    return this.salles.size;
  }
}

module.exports = SalleRepository;
