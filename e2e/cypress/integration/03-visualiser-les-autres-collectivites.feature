# language: fr

Fonctionnalité: Visualiser toutes les collectivités

  Scénario: Filtrer les collectivités
    Etant donné que je suis connecté en tant que "yolo"

    Quand je visite la vue "toutes les collectivités"
    Alors la page contient 5 collectivités
    Et le "bouton Désactiver tous les filtres" est absent

    Quand je sélectionne l'option "Bretagne" dans le filtre par région
    Alors la page contient 0 collectivité
    Et le "bouton Désactiver tous les filtres" est visible

    Quand je désactive tous les filtres
    Alors la page contient 5 collectivités
    Et le "bouton Désactiver tous les filtres" est absent

    Quand je sélectionne l'option "Auvergne" dans le filtre par région
    Alors la page contient 5 collectivités

    Quand je coche l'option "1ère étoile" dans le filtre par niveau de labellisation
    Alors la page contient 1 collectivité
