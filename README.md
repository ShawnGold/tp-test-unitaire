# TP Système de Réservation de Salles

## Description

Application web de gestion des réservations de salles de réunion développée dans le cadre du TP sur les tests unitaires. Ce TP implémente une architecture en couches avec des tests complets utilisant Jest et Cucumber.

**Auteur :** BUFFET Evan

## Architecture du TP

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
- Interface moderne et responsive
- Compatible mobile et desktop
- Système de notifications en temps réel
- Sauvegarde automatique en localStorage
- Données de démonstration préchargées

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

## Tests Unitaires et BDD

### Philosophie des Tests

Ce TP implémente une approche **hybride TDD/BDD** (Test-Driven Development / Behavior-Driven Development) avec une couverture complète des fonctionnalités métier :

- **TDD avec Jest** : Tests unitaires classiques pour la logique métier
- **BDD avec Cucumber** : Tests comportementaux en langage naturel pour les scénarios métier

### Structure des Tests

```
tests/                              # Tests unitaires (TDD)
├── models/
│   ├── Salle.test.js              # Tests du modèle Salle
│   └── Reservation.test.js        # Tests du modèle Reservation
└── services/
    └── ReservationService.test.js # Tests de la logique métier

features/                          # Tests BDD (Cucumber)
├── gestion_salles.feature         # Scénarios de gestion des salles
├── reservation_salles.feature     # Scénarios de réservation
├── consultation_reservations.feature # Scénarios de consultation
├── step_definitions/              # Implémentation des étapes
│   ├── gestion_salles_steps.js
│   ├── reservation_salles_steps.js
│   └── consultation_reservations_steps.js
└── support/
    └── world.js                   # Contexte partagé
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

#### Tests BDD (`features/`)

**Tests comportementaux avec Cucumber** - Scénarios en langage naturel :

**gestion_salles.feature** :
- ✅ Ajouter une nouvelle salle avec validation
- ✅ Modifier une salle existante
- ✅ Supprimer une salle et ses réservations
- ✅ Gestion des erreurs de validation

**reservation_salles.feature** :
- ✅ Réserver une salle disponible
- ✅ Réservations sur plusieurs jours
- ✅ Gestion des conflits horaires
- ✅ Validation des capacités et horaires
- ✅ Annulation de réservations

**consultation_reservations.feature** :
- ✅ Consultation par date et par salle
- ✅ Tri automatique des résultats
- ✅ Vérification de disponibilité
- ✅ Gestion des cas limites

### Exécution des Tests

```bash
# Tests unitaires (TDD)
npm test
npm run test:watch
npm run test:coverage

# Tests BDD (Cucumber)
npm run test:bdd
npm run test:bdd:report  # Génère un rapport HTML

# Tous les tests
npm run test:all
```

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

---

*TP réalisé dans le cadre du module CS2I/M1 - Tests Unitaires*