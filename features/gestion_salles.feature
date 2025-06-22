# language: fr
Fonctionnalité: Gestion des salles de réunion
  En tant qu'administrateur
  Je veux gérer les salles de réunion
  Afin de pouvoir les proposer aux utilisateurs pour leurs réservations

  Contexte:
    Étant donné que le système de réservation est initialisé

  Scénario: Ajouter une nouvelle salle
    Quand j'ajoute une salle "Salle Alpha" avec une capacité de 12 personnes
    Alors la salle "Salle Alpha" devrait être créée avec succès
    Et la salle devrait avoir une capacité de 12 personnes
    Et la salle devrait avoir un identifiant unique

  Scénario: Modifier une salle existante
    Étant donné qu'une salle "Salle Beta" existe avec une capacité de 8 personnes
    Quand je modifie la salle "Salle Beta" pour avoir le nom "Salle Beta Rénovée" et une capacité de 15 personnes
    Alors la salle devrait avoir le nom "Salle Beta Rénovée"
    Et la salle devrait avoir une capacité de 15 personnes

  Scénario: Supprimer une salle
    Étant donné qu'une salle "Salle Gamma" existe avec une capacité de 6 personnes
    Et qu'une réservation existe pour cette salle
    Quand je supprime la salle "Salle Gamma"
    Alors la salle "Salle Gamma" ne devrait plus exister
    Et toutes les réservations de cette salle devraient être supprimées

  Scénario: Tentative d'ajout d'une salle invalide
    Quand j'essaie d'ajouter une salle avec un nom vide
    Alors une erreur "Le nom de la salle est obligatoire" devrait être levée

  Scénario: Tentative d'ajout d'une salle avec capacité invalide
    Quand j'essaie d'ajouter une salle "Salle Test" avec une capacité de 0 personnes
    Alors une erreur "La capacité doit être supérieure à 0" devrait être levée
