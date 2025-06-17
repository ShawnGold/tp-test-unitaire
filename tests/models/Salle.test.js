/**
 * Tests pour le modèle Salle
 * @author BUFFET Evan
 */

const Salle = require('../../src/models/Salle');

describe('Salle - Gestion des salles de réunion', () => {
  describe('Création d\'une salle', () => {
    test('devrait créer une salle avec un nom et une capacité', () => {
      // Given
      const nom = 'Salle de conférence A';
      const capacite = 10;

      // When
      const salle = new Salle(nom, capacite);

      // Then
      expect(salle.nom).toBe(nom);
      expect(salle.capacite).toBe(capacite);
      expect(salle.id).toBeDefined();
    });

    test('devrait générer un ID unique pour chaque salle', () => {
      // Given
      const salle1 = new Salle('Salle A', 5);
      const salle2 = new Salle('Salle B', 8);

      // Then
      expect(salle1.id).not.toBe(salle2.id);
    });

    test('devrait lever une erreur si le nom est vide', () => {
      // When & Then
      expect(() => new Salle('', 10)).toThrow('Le nom de la salle est obligatoire');
    });

    test('devrait lever une erreur si la capacité est négative ou nulle', () => {
      // When & Then
      expect(() => new Salle('Salle A', 0)).toThrow('La capacité doit être supérieure à 0');
      expect(() => new Salle('Salle A', -5)).toThrow('La capacité doit être supérieure à 0');
    });

    test('devrait lever une erreur si la capacité n\'est pas un nombre', () => {
      // When & Then
      expect(() => new Salle('Salle A', 'dix')).toThrow('La capacité doit être un nombre');
    });
  });

  describe('Modification d\'une salle', () => {
    let salle;

    beforeEach(() => {
      salle = new Salle('Salle A', 10);
    });

    test('devrait permettre de modifier le nom', () => {
      // Given
      const nouveauNom = 'Salle A - Rénovée';

      // When
      salle.modifierNom(nouveauNom);

      // Then
      expect(salle.nom).toBe(nouveauNom);
    });

    test('devrait permettre de modifier la capacité', () => {
      // Given
      const nouvelleCapacite = 15;

      // When
      salle.modifierCapacite(nouvelleCapacite);

      // Then
      expect(salle.capacite).toBe(nouvelleCapacite);
    });

    test('devrait lever une erreur lors de la modification avec un nom vide', () => {
      // When & Then
      expect(() => salle.modifierNom('')).toThrow('Le nom de la salle est obligatoire');
    });

    test('devrait lever une erreur lors de la modification avec une capacité invalide', () => {
      // When & Then
      expect(() => salle.modifierCapacite(0)).toThrow('La capacité doit être supérieure à 0');
    });
  });

  describe('Informations de la salle', () => {
    test('devrait retourner les informations sous forme d\'objet', () => {
      // Given
      const salle = new Salle('Salle Executive', 20);

      // When
      const infos = salle.getInfos();

      // Then
      expect(infos).toEqual({
        id: salle.id,
        nom: 'Salle Executive',
        capacite: 20
      });
    });
  });
});
