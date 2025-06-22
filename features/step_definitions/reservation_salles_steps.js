const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

// Contexte des réservations
Given('une réservation existe pour la salle {string} du {string} au {string} de {string} à {string} pour {int} personnes', 
function (nomSalle, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes) {
  this.createReservation(nomSalle, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes);
});

Given('une réservation existe pour cette salle', function () {
  // Utilise la dernière salle créée pour créer une réservation
  const dernieresSalles = Array.from(this.salles.entries());
  assert(dernieresSalles.length > 0, 'Aucune salle disponible pour créer une réservation');
  
  const [nomSalle] = dernieresSalles[dernieresSalles.length - 1];
  this.createReservation(nomSalle, '2025-06-25', '2025-06-25', '10:00', '12:00', 5);
});

// Actions de réservation
When('je réserve la salle {string} du {string} au {string} de {string} à {string} pour {int} personnes', 
function (nomSalle, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes) {
  try {
    this.lastResult = this.createReservation(nomSalle, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes);
  } catch (error) {
    this.lastError = error;
  }
});

When('j\'essaie de réserver la salle {string} du {string} au {string} de {string} à {string} pour {int} personnes', 
function (nomSalle, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes) {
  try {
    this.createReservation(nomSalle, dateDebut, dateFin, heureDebut, heureFin, nombrePersonnes);
  } catch (error) {
    this.lastError = error;
  }
});

When('je supprime cette réservation', function () {
  try {
    assert(this.lastReservation, 'Aucune réservation à supprimer');
    this.lastResult = this.reservationService.supprimerReservation(this.lastReservation.id);
    this.reservations.delete(this.lastReservation.id);
  } catch (error) {
    this.lastError = error;
  }
});

// Vérifications des réservations
Then('la réservation devrait être créée avec succès', function () {
  assert(this.lastResult, 'La réservation devrait être créée');
  assert(this.lastResult.id, 'La réservation devrait avoir un ID');
  assert(!this.lastError, `Aucune erreur ne devrait être présente: ${this.lastError?.message}`);
});

Then('la réservation devrait contenir les informations correctes', function () {
  assert(this.lastResult, 'Aucune réservation disponible');
  assert(this.lastResult.salleId, 'La réservation devrait avoir un ID de salle');
  assert(this.lastResult.dateDebut, 'La réservation devrait avoir une date de début');
  assert(this.lastResult.dateFin, 'La réservation devrait avoir une date de fin');
  assert(this.lastResult.heureDebut, 'La réservation devrait avoir une heure de début');
  assert(this.lastResult.heureFin, 'La réservation devrait avoir une heure de fin');
  assert(this.lastResult.nombrePersonnes, 'La réservation devrait avoir un nombre de personnes');
});

Then('la durée de la réservation devrait être de {int} jours', function (joursAttendus) {
  assert(this.lastResult, 'Aucune réservation disponible');
  
  const dateDebut = new Date(this.lastResult.dateDebut);
  const dateFin = new Date(this.lastResult.dateFin);
  const diffTime = Math.abs(dateFin - dateDebut);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 car on compte le jour de début
  
  assert.strictEqual(diffDays, joursAttendus, `La durée devrait être de ${joursAttendus} jours`);
});

Then('la réservation ne devrait plus exister', function () {
  assert(this.lastReservation, 'Aucune réservation de référence');
  
  const reservationsExistantes = this.reservationService.getReservations();
  const reservationExiste = reservationsExistantes.some(r => r.id === this.lastReservation.id);
  
  assert(!reservationExiste, 'La réservation ne devrait plus exister');
});

Then('la salle devrait être disponible pour cette plage horaire', function () {
  assert(this.lastReservation, 'Aucune réservation de référence');
  
  const salle = Array.from(this.salles.values()).find(s => s.id === this.lastReservation.salleId);
  assert(salle, 'Salle non trouvée');
  
  // Vérifier qu'il n'y a pas de conflit pour cette plage horaire
  const conflits = this.reservationService.getReservationsParSalle(salle.id)
    .filter(r => {
      const memeDate = new Date(r.dateDebut).toDateString() === new Date(this.lastReservation.dateDebut).toDateString();
      const chevauchement = !(r.heureFin <= this.lastReservation.heureDebut || r.heureDebut >= this.lastReservation.heureFin);
      return memeDate && chevauchement;
    });
  
  assert.strictEqual(conflits.length, 0, 'Il ne devrait y avoir aucun conflit pour cette plage horaire');
});
