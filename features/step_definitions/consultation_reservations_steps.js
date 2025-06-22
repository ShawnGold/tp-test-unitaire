const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

// Actions de consultation
When('je consulte les réservations du {string}', function (dateStr) {
  try {
    const date = new Date(dateStr);
    this.lastResult = this.reservationService.getReservationsParJour(date);
  } catch (error) {
    this.lastError = error;
  }
});

When('je consulte les réservations de la salle {string}', function (nomSalle) {
  try {
    const salle = this.getSalle(nomSalle);
    if (salle) {
      this.lastResult = this.reservationService.getReservationsParSalle(salle.id);
    } else {
      this.lastResult = [];
    }
  } catch (error) {
    this.lastError = error;
  }
});

When('j\'essaie de consulter les réservations de la salle {string}', function (nomSalle) {
  try {
    const salle = this.getSalle(nomSalle);
    if (salle) {
      this.lastResult = this.reservationService.getReservationsParSalle(salle.id);
    } else {
      this.lastResult = [];
    }
  } catch (error) {
    this.lastError = error;
    this.lastResult = [];
  }
});

When('je vérifie la disponibilité de la salle {string} du {string} au {string} de {string} à {string}', 
function (nomSalle, dateDebut, dateFin, heureDebut, heureFin) {
  try {
    const salle = this.getSalle(nomSalle);
    assert(salle, `Salle "${nomSalle}" non trouvée`);
    
    // Simuler une vérification de disponibilité en essayant de créer une réservation temporaire
    const reservationsExistantes = this.reservationService.getReservationsParSalle(salle.id);
    
    const dateDebutObj = new Date(dateDebut);
    const dateFinObj = new Date(dateFin);
    
    const conflits = reservationsExistantes.filter(reservation => {
      // Vérifier si les dates se chevauchent
      const debutExistant = new Date(reservation.dateDebut);
      const finExistant = new Date(reservation.dateFin);
      
      if (dateFinObj < debutExistant || dateDebutObj > finExistant) {
        return false;
      }
      
      // Si les dates se chevauchent, vérifier les heures
      if (heureFin <= reservation.heureDebut || heureDebut >= reservation.heureFin) {
        return false;
      }
      
      return true;
    });
    
    this.lastResult = {
      disponible: conflits.length === 0,
      conflits: conflits
    };
  } catch (error) {
    this.lastError = error;
  }
});

// Vérifications de consultation
Then('je devrais voir {int} réservations', function (nombreAttendu) {
  assert(Array.isArray(this.lastResult), 'Le résultat devrait être un tableau');
  assert.strictEqual(this.lastResult.length, nombreAttendu, 
    `Je devrais voir ${nombreAttendu} réservations, mais j'en vois ${this.lastResult.length}`);
});

Then('les réservations devraient être triées par heure de début', function () {
  assert(Array.isArray(this.lastResult), 'Le résultat devrait être un tableau');
  
  if (this.lastResult.length > 1) {
    for (let i = 1; i < this.lastResult.length; i++) {
      const precedente = this.lastResult[i - 1];
      const courante = this.lastResult[i];
      
      // Comparer les dates d'abord
      const datePrecedente = new Date(precedente.dateDebut);
      const dateCourante = new Date(courante.dateDebut);
      
      if (datePrecedente.getTime() === dateCourante.getTime()) {
        // Même date, comparer les heures
        assert(precedente.heureDebut <= courante.heureDebut, 
          'Les réservations devraient être triées par heure de début');
      } else {
        assert(datePrecedente <= dateCourante, 
          'Les réservations devraient être triées par date puis par heure');
      }
    }
  }
});

Then('toutes les réservations devraient être pour la salle {string}', function (nomSalle) {
  assert(Array.isArray(this.lastResult), 'Le résultat devrait être un tableau');
  
  const salle = this.getSalle(nomSalle);
  assert(salle, `Salle "${nomSalle}" non trouvée`);
  
  this.lastResult.forEach(reservation => {
    assert.strictEqual(reservation.salleId, salle.id, 
      `Toutes les réservations devraient être pour la salle "${nomSalle}"`);
  });
});

Then('la salle devrait être {word}', function (disponibilite) {
  assert(this.lastResult, 'Aucun résultat de vérification de disponibilité');
  
  const estDisponible = this.lastResult.disponible;
  
  if (disponibilite === 'disponible') {
    assert(estDisponible, 'La salle devrait être disponible');
  } else if (disponibilite === 'indisponible') {
    assert(!estDisponible, 'La salle devrait être indisponible');
  } else {
    throw new Error(`État de disponibilité non reconnu: ${disponibilite}`);
  }
});
