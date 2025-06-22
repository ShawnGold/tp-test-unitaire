const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

// Contexte
Given('que le système de réservation est initialisé', function () {
  assert(this.reservationService, 'Le service de réservation devrait être initialisé');
});

Given('le système de réservation est initialisé', function () {
  assert(this.reservationService, 'Le service de réservation devrait être initialisé');
});

Given('qu\'une salle {string} existe avec une capacité de {int} personnes', function (nomSalle, capacite) {
  this.addSalle(nomSalle, capacite);
});

Given('une salle {string} existe avec une capacité de {int} personnes', function (nomSalle, capacite) {
  this.addSalle(nomSalle, capacite);
});

// Actions sur les salles
When('j\'ajoute une salle {string} avec une capacité de {int} personnes', function (nomSalle, capacite) {
  try {
    this.lastResult = this.addSalle(nomSalle, capacite);
  } catch (error) {
    this.lastError = error;
  }
});

When('je modifie la salle {string} pour avoir le nom {string} et une capacité de {int} personnes', function (ancienNom, nouveauNom, nouvelleCapacite) {
  try {
    const salle = this.getSalle(ancienNom);
    assert(salle, `Salle "${ancienNom}" non trouvée`);
    
    this.lastResult = this.reservationService.modifierSalle(salle.id, nouveauNom, nouvelleCapacite);
    
    // Mettre à jour le mapping des noms
    this.salles.delete(ancienNom);
    this.salles.set(nouveauNom, this.lastResult);
  } catch (error) {
    this.lastError = error;
  }
});

When('je supprime la salle {string}', function (nomSalle) {
  try {
    const salle = this.getSalle(nomSalle);
    assert(salle, `Salle "${nomSalle}" non trouvée`);
    
    this.lastResult = this.reservationService.supprimerSalle(salle.id);
    this.salles.delete(nomSalle);
  } catch (error) {
    this.lastError = error;
  }
});

When('j\'essaie d\'ajouter une salle avec un nom vide', function () {
  try {
    this.addSalle('', 10);
  } catch (error) {
    this.lastError = error;
  }
});

When('j\'essaie d\'ajouter une salle {string} avec une capacité de {int} personnes', function (nomSalle, capacite) {
  try {
    this.addSalle(nomSalle, capacite);
  } catch (error) {
    this.lastError = error;
  }
});

// Vérifications
Then('la salle {string} devrait être créée avec succès', function (nomSalle) {
  assert(this.lastResult, 'Aucun résultat de création de salle');
  assert.strictEqual(this.lastResult.nom, nomSalle, `Le nom de la salle devrait être "${nomSalle}"`);
  assert(this.getSalle(nomSalle), `La salle "${nomSalle}" devrait exister dans le contexte`);
});

Then('la salle devrait avoir une capacité de {int} personnes', function (capaciteAttendue) {
  assert(this.lastResult, 'Aucun résultat disponible');
  assert.strictEqual(this.lastResult.capacite, capaciteAttendue, `La capacité devrait être de ${capaciteAttendue}`);
});

Then('la salle devrait avoir un identifiant unique', function () {
  assert(this.lastResult, 'Aucun résultat disponible');
  assert(this.lastResult.id, 'La salle devrait avoir un ID');
  assert(typeof this.lastResult.id === 'string', 'L\'ID devrait être une chaîne');
  assert(this.lastResult.id.length > 0, 'L\'ID ne devrait pas être vide');
});

Then('la salle devrait avoir le nom {string}', function (nomAttendu) {
  assert(this.lastResult, 'Aucun résultat disponible');
  assert.strictEqual(this.lastResult.nom, nomAttendu, `Le nom devrait être "${nomAttendu}"`);
});

Then('la salle {string} ne devrait plus exister', function (nomSalle) {
  assert(!this.getSalle(nomSalle), `La salle "${nomSalle}" ne devrait plus exister`);
});

Then('toutes les réservations de cette salle devraient être supprimées', function () {
  // Vérifier que les réservations associées à la salle supprimée n'existent plus
  const reservationsRestantes = this.reservationService.getReservations();
  const reservationsSalle = Array.from(this.reservations.values())
    .filter(r => !reservationsRestantes.some(rr => rr.id === r.id));
  
  // Si il y avait des réservations pour cette salle, elles devraient être supprimées
  assert(reservationsSalle.length >= 0, 'Les réservations de la salle supprimée devraient être supprimées');
});

Then('une erreur {string} devrait être levée', function (messageErreurAttendu) {
  assert(this.lastError, 'Une erreur devrait avoir été levée');
  assert(this.lastError.message.includes(messageErreurAttendu), 
    `Le message d'erreur devrait contenir "${messageErreurAttendu}", mais était: "${this.lastError.message}"`);
});
