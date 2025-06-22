# language: fr
Fonctionnalité: Réservation de salles de réunion
  En tant qu'utilisateur
  Je veux réserver une salle de réunion
  Afin d'organiser mes réunions

  Contexte:
    Étant donné que le système de réservation est initialisé
    Et qu'une salle "Salle Conférence" existe avec une capacité de 20 personnes
    Et qu'une salle "Salle Réunion" existe avec une capacité de 8 personnes

  Scénario: Réserver une salle disponible
    Quand je réserve la salle "Salle Conférence" du "2025-06-25" au "2025-06-25" de "09:00" à "11:00" pour 15 personnes
    Alors la réservation devrait être créée avec succès
    Et la réservation devrait contenir les informations correctes

  Scénario: Réserver une salle sur plusieurs jours
    Quand je réserve la salle "Salle Conférence" du "2025-06-25" au "2025-06-27" de "14:00" à "16:00" pour 10 personnes
    Alors la réservation devrait être créée avec succès
    Et la durée de la réservation devrait être de 3 jours

  Scénario: Tentative de réservation avec dépassement de capacité
    Quand j'essaie de réserver la salle "Salle Réunion" du "2025-06-25" au "2025-06-25" de "09:00" à "11:00" pour 15 personnes
    Alors une erreur "La salle ne peut accueillir que 8 personnes maximum" devrait être levée

  Scénario: Tentative de réservation avec horaires invalides
    Quand j'essaie de réserver la salle "Salle Conférence" du "2025-06-25" au "2025-06-25" de "11:00" à "09:00" pour 10 personnes
    Alors une erreur "L'heure de début doit être antérieure à l'heure de fin" devrait être levée

  Scénario: Tentative de réservation avec dates invalides
    Quand j'essaie de réserver la salle "Salle Conférence" du "2025-06-27" au "2025-06-25" de "09:00" à "11:00" pour 10 personnes
    Alors une erreur "La date de début doit être antérieure ou égale à la date de fin" devrait être levée

  Scénario: Tentative de réservation d'une salle déjà occupée
    Étant donné qu'une réservation existe pour la salle "Salle Conférence" du "2025-06-25" au "2025-06-25" de "10:00" à "12:00" pour 8 personnes
    Quand j'essaie de réserver la salle "Salle Conférence" du "2025-06-25" au "2025-06-25" de "11:00" à "13:00" pour 5 personnes
    Alors une erreur "La salle est déjà réservée sur cette plage horaire" devrait être levée

  Scénario: Réservation de salles différentes au même moment
    Étant donné qu'une réservation existe pour la salle "Salle Conférence" du "2025-06-25" au "2025-06-25" de "10:00" à "12:00" pour 8 personnes
    Quand je réserve la salle "Salle Réunion" du "2025-06-25" au "2025-06-25" de "11:00" à "13:00" pour 6 personnes
    Alors la réservation devrait être créée avec succès

  Scénario: Annuler une réservation
    Étant donné qu'une réservation existe pour la salle "Salle Conférence" du "2025-06-25" au "2025-06-25" de "14:00" à "16:00" pour 12 personnes
    Quand je supprime cette réservation
    Alors la réservation ne devrait plus exister
    Et la salle devrait être disponible pour cette plage horaire
