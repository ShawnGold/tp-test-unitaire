# Système de Réservation de Salles

## Description

Application web de gestion des réservations de salles de réunion développée dans le cadre du TP sur les tests unitaires. Ce projet implémente une architecture en couches avec des tests complets utilisant Jest.

**Auteur :** BUFFET Evan

## Architecture du Projet

### Structure des Dossiers

```
├── src/                    # Code source de l'application
│   ├── models/            # Modèles de données (Salle, Reservation)
│   ├── services/          # Logique métier (ReservationService)
│   ├── repositories/      # Gestion de la persistance
│   └── controllers/       # Interface entre UI et services
├── public/                # Interface web (HTML, CSS, JS)
├── tests/                 # Tests unitaires
└── server.js             # Serveur Express
```

### Architecture en Couches

1. **Modèles** : Représentent les entités métier (Salle, Reservation)
2. **Services** : Contiennent la logique métier et les règles de validation
3. **Repositories** : Gèrent la persistance des données en mémoire
4. **Controllers** : Interface entre l'interface utilisateur et les services

## Application Web

### Fonctionnalités

#### Gestion des Salles
- ✅ Ajouter une nouvelle salle avec nom et capacité
- ✅ Modifier les informations d'une salle existante
- ✅ Supprimer une salle (supprime aussi ses réservations)
- ✅ Visualiser la liste de toutes les salles

#### Gestion des Réservations
- ✅ Créer une réservation avec date, heure et nombre de personnes
- ✅ Vérification automatique des conflits horaires
- ✅ Validation de la capacité de la salle
- ✅ Annuler une réservation existante
- ✅ Filtrer les réservations par date ou par salle

#### Interface Utilisateur
- 🎨 Interface moderne et responsive
- 📱 Compatible mobile et desktop
- 🔔 Système de notifications en temps réel
- 💾 Sauvegarde automatique en localStorage
- 📊 Données de démonstration préchargées

### Démarrage de l'Application

```bash
# Installation des dépendances
npm install

# Démarrage du serveur
npm start

# Ou en mode développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Tests Unitaires

### Philosophie des Tests

Ce projet implémente une approche TDD (Test-Driven Development) avec une couverture complète des fonctionnalités métier.

### Structure des Tests

```
tests/
├── models/
│   ├── Salle.test.js         # Tests du modèle Salle
│   └── Reservation.test.js   # Tests du modèle Reservation
└── services/
    └── ReservationService.test.js  # Tests de la logique métier
```

### Types de Tests Implémentés

#### Tests des Modèles (`models/`)

**Salle.test.js** - Teste le modèle Salle :
- ✅ Création avec validation des paramètres
- ✅ Modification du nom et de la capacité
- ✅ Gestion des erreurs (nom vide, capacité invalide)
- ✅ Génération d'ID uniques
- ✅ Serialisation des informations

**Reservation.test.js** - Teste le modèle Reservation :
- ✅ Création avec validation complète des créneaux
- ✅ Validation des formats de dates et heures
- ✅ Détection des chevauchements entre réservations
- ✅ Validation de la cohérence temporelle
- ✅ Gestion des erreurs de paramètres

#### Tests des Services (`services/`)

**ReservationService.test.js** - Teste la logique métier :
- ✅ Gestion complète du cycle de vie des salles
- ✅ Création et validation des réservations
- ✅ Détection des conflits horaires
- ✅ Filtrage par date et par salle
- ✅ Gestion des erreurs métier (salle inexistante, capacité dépassée)

### Exécution des Tests

```bash
# Lancer tous les tests
npm test

# Mode watch (relance automatique)
npm run test:watch

# Génération du rapport de couverture
npm run test:coverage
```

### Exemple de Sortie des Tests

```bash
PASS tests/models/Salle.test.js
PASS tests/models/Reservation.test.js  
PASS tests/services/ReservationService.test.js

Test Suites: 3 passed, 3 total
Tests:       25 passed, 25 total
Coverage:    100% statements, 100% branches, 100% functions, 100% lines
```

### Couverture de Code

Le projet vise une couverture de 100% avec Jest :
- **Statements** : Toutes les instructions exécutées
- **Branches** : Tous les chemins conditionnels testés  
- **Functions** : Toutes les fonctions appelées
- **Lines** : Toutes les lignes de code couvertes

## Technologies Utilisées

### Backend
- **Node.js** : Runtime JavaScript
- **Express.js** : Serveur web minimaliste
- **UUID** : Génération d'identifiants uniques

### Frontend  
- **HTML5/CSS3** : Interface utilisateur moderne
- **JavaScript ES6+** : Logique côté client
- **CSS Grid/Flexbox** : Layout responsive

### Tests
- **Jest** : Framework de tests unitaires
- **Coverage** : Rapport de couverture de code

## Règles Métier Implémentées

### Validation des Salles
- Le nom ne peut pas être vide
- La capacité doit être un nombre positif
- Chaque salle a un ID unique

### Validation des Réservations
- Les dates de début et fin doivent être cohérentes
- Le format des heures doit être HH:MM (24h)
- L'heure de début doit être antérieure à l'heure de fin
- Le nombre de personnes ne peut pas dépasser la capacité de la salle
- Aucune réservation ne peut chevaucher dans la même salle

### Gestion des Conflits
- Détection automatique des chevauchements temporels
- Vérification de la disponibilité avant création
- Suppression en cascade des réservations lors de la suppression d'une salle

## Exemple d'Utilisation

```javascript
// Création d'une salle
const service = new ReservationService();
const salle = service.ajouterSalle('Salle de Formation', 20);

// Création d'une réservation
const reservation = service.creerReservation(
  salle.id,
  new Date('2025-06-25'),
  new Date('2025-06-25'), 
  '09:00',
  '11:00',
  15
);

// Consultation des réservations
const reservationsDuJour = service.getReservationsParJour(new Date('2025-06-25'));
```

## Contribution

1. Cloner le repository
2. Installer les dépendances : `npm install`
3. Lancer les tests : `npm test`
4. Développer en TDD : écrire les tests avant le code
5. Vérifier la couverture : `npm run test:coverage`

---

*Projet réalisé dans le cadre du module CS2I/M1 - Tests Unitaires*