# language: fr
Fonctionnalité: Consultation des réservations
  En tant qu'utilisateur
  Je veux consulter les réservations
  Afin de connaître la disponibilité des salles

  Contexte:
    Étant donné que le système de réservation est initialisé
    Et qu'une salle "Salle A" existe avec une capacité de 10 personnes
    Et qu'une salle "Salle B" existe avec une capacité de 15 personnes

  Scénario: Consulter les réservations d'un jour donné
    Étant donné qu'une réservation existe pour la salle "Salle A" du "2025-06-25" au "2025-06-25" de "09:00" à "11:00" pour 8 personnes
    Et qu'une réservation existe pour la salle "Salle B" du "2025-06-25" au "2025-06-25" de "14:00" à "16:00" pour 12 personnes
    Et qu'une réservation existe pour la salle "Salle A" du "2025-06-26" au "2025-06-26" de "10:00" à "12:00" pour 6 personnes
    Quand je consulte les réservations du "2025-06-25"
    Alors je devrais voir 2 réservations
    Et les réservations devraient être triées par heure de début

  Scénario: Consulter les réservations d'une salle spécifique
    Étant donné qu'une réservation existe pour la salle "Salle A" du "2025-06-25" au "2025-06-25" de "09:00" à "11:00" pour 8 personnes
    Et qu'une réservation existe pour la salle "Salle B" du "2025-06-25" au "2025-06-25" de "14:00" à "16:00" pour 12 personnes
    Et qu'une réservation existe pour la salle "Salle A" du "2025-06-26" au "2025-06-26" de "10:00" à "12:00" pour 6 personnes
    Quand je consulte les réservations de la salle "Salle A"
    Alors je devrais voir 2 réservations
    Et toutes les réservations devraient être pour la salle "Salle A"

  Scénario: Consulter les réservations d'un jour sans réservation
    Quand je consulte les réservations du "2025-12-25"
    Alors je devrais voir 0 réservations

  Scénario: Consulter les réservations d'une salle inexistante
    Quand j'essaie de consulter les réservations de la salle "Salle Inexistante"
    Alors je devrais voir 0 réservations

  Scénario: Vérifier la disponibilité d'une salle
    Étant donné qu'une réservation existe pour la salle "Salle A" du "2025-06-25" au "2025-06-25" de "10:00" à "12:00" pour 8 personnes
    Quand je vérifie la disponibilité de la salle "Salle A" du "2025-06-25" au "2025-06-25" de "09:00" à "11:00"
    Alors la salle devrait être indisponible
    Quand je vérifie la disponibilité de la salle "Salle A" du "2025-06-25" au "2025-06-25" de "13:00" à "15:00"
    Alors la salle devrait être disponible
