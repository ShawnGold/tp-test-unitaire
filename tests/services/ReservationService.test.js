/**
 * Tests pour le service de réservation
 * @author BUFFET Evan
 */

const ReservationService = require('../../src/services/ReservationService');
const Salle = require('../../src/models/Salle');
const Reservation = require('../../src/models/Reservation');

describe('ReservationService - Logique métier des réservations', () => {
  let service;

  beforeEach(() => {
    service = new ReservationService();
  });

  describe('Gestion des salles', () => {
    test('devrait ajouter une nouvelle salle', () => {
      // Given
      const nom = 'Salle de formation';
      const capacite = 15;

      // When
      const salle = service.ajouterSalle(nom, capacite);

      // Then
      expect(salle).toBeInstanceOf(Salle);
      expect(salle.nom).toBe(nom);
      expect(salle.capacite).toBe(capacite);
      expect(service.getSalles()).toContain(salle);
    });

    test('devrait modifier une salle existante', () => {
      // Given
      const salle = service.ajouterSalle('Salle A', 10);
      const nouveauNom = 'Salle A - Rénovée';
      const nouvelleCapacite = 12;

      // When
      const salleModifiee = service.modifierSalle(salle.id, nouveauNom, nouvelleCapacite);

      // Then
      expect(salleModifiee.nom).toBe(nouveauNom);
      expect(salleModifiee.capacite).toBe(nouvelleCapacite);
    });

    test('devrait supprimer une salle', () => {
      // Given
      const salle = service.ajouterSalle('Salle à supprimer', 8);
      const salleId = salle.id;

      // When
      const supprimee = service.supprimerSalle(salleId);

      // Then
      expect(supprimee).toBe(true);
      expect(service.getSalles().find(s => s.id === salleId)).toBeUndefined();
    });

    test('devrait lever une erreur lors de la modification d\'une salle inexistante', () => {
      // When & Then
      expect(() => service.modifierSalle('salle-inexistante', 'Nom', 10))
        .toThrow('Salle non trouvée');
    });

    test('devrait retourner false lors de la suppression d\'une salle inexistante', () => {
      // When
      const resultat = service.supprimerSalle('salle-inexistante');

      // Then
      expect(resultat).toBe(false);
    });
  });

  describe('Création de réservations', () => {
    let salle;

    beforeEach(() => {
      salle = service.ajouterSalle('Salle de test', 10);
    });

    test('devrait créer une réservation valide', () => {
      // Given
      const dateDebut = new Date('2025-06-25');
      const dateFin = new Date('2025-06-25');
      const heureDebut = '09:00';
      const heureFin = '11:00';
      const nombrePersonnes = 5;

      // When
      const reservation = service.creerReservation(
        salle.id,
        dateDebut,
        dateFin,
        heureDebut,
        heureFin,
        nombrePersonnes
      );

      // Then
      expect(reservation).toBeInstanceOf(Reservation);
      expect(reservation.salleId).toBe(salle.id);
      expect(service.getReservations()).toContain(reservation);
    });

    test('devrait lever une erreur si la salle n\'existe pas', () => {
      // When & Then
      expect(() => service.creerReservation(
        'salle-inexistante',
        new Date('2025-06-25'),
        new Date('2025-06-25'),
        '09:00',
        '11:00',
        5
      )).toThrow('Salle non trouvée');
    });

    test('devrait lever une erreur si le nombre de personnes dépasse la capacité', () => {
      // When & Then
      expect(() => service.creerReservation(
        salle.id,
        new Date('2025-06-25'),
        new Date('2025-06-25'),
        '09:00',
        '11:00',
        15 // Dépasse la capacité de 10
      )).toThrow('La salle ne peut accueillir que 10 personnes maximum');
    });

    test('devrait lever une erreur si la salle est déjà réservée à ce créneau', () => {
      // Given
      service.creerReservation(
        salle.id,
        new Date('2025-06-25'),
        new Date('2025-06-25'),
        '09:00',
        '11:00',
        5
      );

      // When & Then
      expect(() => service.creerReservation(
        salle.id,
        new Date('2025-06-25'),
        new Date('2025-06-25'),
        '10:00',
        '12:00',
        3
      )).toThrow('La salle est déjà réservée sur cette plage horaire');
    });

    test('devrait permettre des réservations non chevauchantes dans la même salle', () => {
      // Given
      service.creerReservation(
        salle.id,
        new Date('2025-06-25'),
        new Date('2025-06-25'),
        '09:00',
        '11:00',
        5
      );

      // When
      const reservation2 = service.creerReservation(
        salle.id,
        new Date('2025-06-25'),
        new Date('2025-06-25'),
        '14:00',
        '16:00',
        3
      );

      // Then
      expect(reservation2).toBeInstanceOf(Reservation);
      expect(service.getReservations()).toHaveLength(2);
    });
  });

  describe('Consultation des réservations', () => {
    let salle1, salle2;

    beforeEach(() => {
      salle1 = service.ajouterSalle('Salle 1', 10);
      salle2 = service.ajouterSalle('Salle 2', 15);
      
      // Créer quelques réservations de test
      service.creerReservation(
        salle1.id,
        new Date('2025-06-25'),
        new Date('2025-06-25'),
        '09:00',
        '11:00',
        5
      );
      
      service.creerReservation(
        salle1.id,
        new Date('2025-06-25'),
        new Date('2025-06-25'),
        '14:00',
        '16:00',
        3
      );
      
      service.creerReservation(
        salle2.id,
        new Date('2025-06-25'),
        new Date('2025-06-25'),
        '10:00',
        '12:00',
        8
      );
      
      service.creerReservation(
        salle1.id,
        new Date('2025-06-26'),
        new Date('2025-06-26'),
        '09:00',
        '11:00',
        4
      );
    });

    test('devrait retourner les réservations d\'un jour donné', () => {
      // When
      const reservationsJour = service.getReservationsParJour(new Date('2025-06-25'));

      // Then
      expect(reservationsJour).toHaveLength(3);
      reservationsJour.forEach(reservation => {
        expect(reservation.dateDebut).toEqual(new Date('2025-06-25'));
      });
    });

    test('devrait retourner les réservations d\'une salle donnée', () => {
      // When
      const reservationsSalle = service.getReservationsParSalle(salle1.id);

      // Then
      expect(reservationsSalle).toHaveLength(3);
      reservationsSalle.forEach(reservation => {
        expect(reservation.salleId).toBe(salle1.id);
      });
    });

    test('devrait retourner un tableau vide pour un jour sans réservations', () => {
      // When
      const reservationsJour = service.getReservationsParJour(new Date('2025-12-25'));

      // Then
      expect(reservationsJour).toEqual([]);
    });

    test('devrait retourner un tableau vide pour une salle sans réservations', () => {
      // Given
      const salleVide = service.ajouterSalle('Salle vide', 5);

      // When
      const reservationsSalle = service.getReservationsParSalle(salleVide.id);

      // Then
      expect(reservationsSalle).toEqual([]);
    });
  });

  describe('Suppression de réservations', () => {
    let salle, reservation;

    beforeEach(() => {
      salle = service.ajouterSalle('Salle de test', 10);
      reservation = service.creerReservation(
        salle.id,
        new Date('2025-06-25'),
        new Date('2025-06-25'),
        '09:00',
        '11:00',
        5
      );
    });

    test('devrait supprimer une réservation existante', () => {
      // When
      const supprimee = service.supprimerReservation(reservation.id);

      // Then
      expect(supprimee).toBe(true);
      expect(service.getReservations()).not.toContain(reservation);
    });

    test('devrait retourner false pour une réservation inexistante', () => {
      // When
      const supprimee = service.supprimerReservation('reservation-inexistante');

      // Then
      expect(supprimee).toBe(false);
    });

    test('devrait permettre de recréer une réservation après suppression', () => {
      // Given
      service.supprimerReservation(reservation.id);

      // When
      const nouvelleReservation = service.creerReservation(
        salle.id,
        new Date('2025-06-25'),
        new Date('2025-06-25'),
        '09:00',
        '11:00',
        7
      );

      // Then
      expect(nouvelleReservation).toBeInstanceOf(Reservation);
      expect(service.getReservations()).toContain(nouvelleReservation);
    });
  });
});
