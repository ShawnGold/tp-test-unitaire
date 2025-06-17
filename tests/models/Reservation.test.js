/**
 * Tests pour le modèle Reservation
 * @author BUFFET Evan
 */

const Reservation = require('../../src/models/Reservation');

describe('Reservation - Gestion des réservations', () => {
  describe('Création d\'une réservation', () => {
    test('devrait créer une réservation valide', () => {
      // Given
      const salleId = 'salle-123';
      const dateDebut = new Date('2025-06-20');
      const dateFin = new Date('2025-06-20');
      const heureDebut = '09:00';
      const heureFin = '11:00';
      const nombrePersonnes = 8;

      // When
      const reservation = new Reservation(salleId, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes);

      // Then
      expect(reservation.salleId).toBe(salleId);
      expect(reservation.dateDebut).toBe(dateDebut);
      expect(reservation.dateFin).toBe(dateFin);
      expect(reservation.heureDebut).toBe(heureDebut);
      expect(reservation.heureFin).toBe(heureFin);
      expect(reservation.nombrePersonnes).toBe(nombrePersonnes);
      expect(reservation.id).toBeDefined();
    });

    test('devrait lever une erreur si l\'heure de début est après l\'heure de fin', () => {
      // Given
      const salleId = 'salle-123';
      const dateDebut = new Date('2025-06-20');
      const dateFin = new Date('2025-06-20');
      const heureDebut = '15:00';
      const heureFin = '14:00';
      const nombrePersonnes = 5;

      // When & Then
      expect(() => new Reservation(salleId, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes))
        .toThrow('L\'heure de début doit être antérieure à l\'heure de fin');
    });

    test('devrait lever une erreur si la date de début est après la date de fin', () => {
      // Given
      const salleId = 'salle-123';
      const dateDebut = new Date('2025-06-22');
      const dateFin = new Date('2025-06-20');
      const heureDebut = '09:00';
      const heureFin = '11:00';
      const nombrePersonnes = 5;

      // When & Then
      expect(() => new Reservation(salleId, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes))
        .toThrow('La date de début doit être antérieure ou égale à la date de fin');
    });

    test('devrait lever une erreur si le nombre de personnes est négatif ou nul', () => {
      // Given
      const salleId = 'salle-123';
      const dateDebut = new Date('2025-06-20');
      const dateFin = new Date('2025-06-20');
      const heureDebut = '09:00';
      const heureFin = '11:00';

      // When & Then
      expect(() => new Reservation(salleId, dateDebut, dateFin, heureDebut, heureFin, 0))
        .toThrow('Le nombre de personnes doit être supérieur à 0');
      expect(() => new Reservation(salleId, dateDebut, dateFin, heureDebut, heureFin, -2))
        .toThrow('Le nombre de personnes doit être supérieur à 0');
    });

    test('devrait lever une erreur si les paramètres obligatoires sont manquants', () => {
      // When & Then
      expect(() => new Reservation()).toThrow('Tous les paramètres sont obligatoires');
      expect(() => new Reservation('salle-123')).toThrow('Tous les paramètres sont obligatoires');
    });
  });

  describe('Validation des créneaux horaires', () => {
    test('devrait valider un format d\'heure correct', () => {
      // Given
      const reservation = new Reservation(
        'salle-123',
        new Date('2025-06-20'),
        new Date('2025-06-20'),
        '09:30',
        '11:45',
        5
      );

      // Then
      expect(reservation.heureDebut).toBe('09:30');
      expect(reservation.heureFin).toBe('11:45');
    });

    test('devrait lever une erreur pour un format d\'heure invalide', () => {
      // When & Then
      expect(() => new Reservation(
        'salle-123',
        new Date('2025-06-20'),
        new Date('2025-06-20'),
        '25:00',
        '11:00',
        5
      )).toThrow('Format d\'heure invalide');

      expect(() => new Reservation(
        'salle-123',
        new Date('2025-06-20'),
        new Date('2025-06-20'),
        '09:70',
        '11:00',
        5
      )).toThrow('Format d\'heure invalide');
    });
  });

  describe('Chevauchement de réservations', () => {
    test('devrait détecter un chevauchement entre deux réservations', () => {
      // Given
      const reservation1 = new Reservation(
        'salle-123',
        new Date('2025-06-20'),
        new Date('2025-06-20'),
        '09:00',
        '11:00',
        5
      );

      const reservation2 = new Reservation(
        'salle-123',
        new Date('2025-06-20'),
        new Date('2025-06-20'),
        '10:00',
        '12:00',
        3
      );

      // When
      const chevauche = reservation1.chevaucheAvec(reservation2);

      // Then
      expect(chevauche).toBe(true);
    });

    test('ne devrait pas détecter de chevauchement pour des créneaux différents', () => {
      // Given
      const reservation1 = new Reservation(
        'salle-123',
        new Date('2025-06-20'),
        new Date('2025-06-20'),
        '09:00',
        '11:00',
        5
      );

      const reservation2 = new Reservation(
        'salle-123',
        new Date('2025-06-20'),
        new Date('2025-06-20'),
        '14:00',
        '16:00',
        3
      );

      // When
      const chevauche = reservation1.chevaucheAvec(reservation2);

      // Then
      expect(chevauche).toBe(false);
    });

    test('ne devrait pas détecter de chevauchement pour des salles différentes', () => {
      // Given
      const reservation1 = new Reservation(
        'salle-123',
        new Date('2025-06-20'),
        new Date('2025-06-20'),
        '09:00',
        '11:00',
        5
      );

      const reservation2 = new Reservation(
        'salle-456',
        new Date('2025-06-20'),
        new Date('2025-06-20'),
        '10:00',
        '12:00',
        3
      );

      // When
      const chevauche = reservation1.chevaucheAvec(reservation2);

      // Then
      expect(chevauche).toBe(false);
    });
  });

  describe('Informations de la réservation', () => {
    test('devrait retourner les informations sous forme d\'objet', () => {
      // Given
      const reservation = new Reservation(
        'salle-123',
        new Date('2025-06-20'),
        new Date('2025-06-20'),
        '09:00',
        '11:00',
        8
      );

      // When
      const infos = reservation.getInfos();

      // Then
      expect(infos).toEqual({
        id: reservation.id,
        salleId: 'salle-123',
        dateDebut: new Date('2025-06-20'),
        dateFin: new Date('2025-06-20'),
        heureDebut: '09:00',
        heureFin: '11:00',
        nombrePersonnes: 8
      });
    });
  });
});
