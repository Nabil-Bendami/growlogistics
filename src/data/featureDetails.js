export const featureDetails = [
  {
    slug: 'tournees-optimisees', product: 'TMS', title: 'Tournées optimisées',
    intro: 'Construisez des tournées adaptées à vos commandes, à vos véhicules et aux horaires de vos clients. Le planning rassemble les contraintes avant le départ.',
    audience: 'Responsables transport et équipes de planification',
    result: 'Une tournée ordonnée, affectée à un chauffeur et à un véhicule, avec les informations nécessaires pour prendre la route.',
    steps: [
      ['Rassembler les livraisons', 'Les commandes à livrer sont centralisées avec leurs destinations et leurs créneaux horaires. Le planificateur dispose des informations nécessaires pour organiser les arrêts.', 'Commandes à planifier', ['Adresses de livraison', 'Créneaux horaires', 'Volumes et poids']],
      ['Construire l’itinéraire', 'Le TMS organise les arrêts en tenant compte des capacités des véhicules et des contraintes de livraison. Les outils d’optimisation permettent de limiter les distances et les temps de trajet.', 'Organisation des arrêts', ['Séquence des destinations', 'Capacité du véhicule', 'Contraintes horaires']],
      ['Affecter les ressources', 'La tournée est affectée à un chauffeur et à un véhicule disponibles. Le planning permet de consulter les affectations et d’ajuster l’organisation.', 'Tournée affectée', ['Chauffeur sélectionné', 'Véhicule affecté', 'Planning de départ']],
      ['Suivre et ajuster', 'Pendant la tournée, le suivi des véhicules et des statuts donne de la visibilité à l’équipe. Les outils de planification permettent d’adapter le parcours aux imprévus.', 'Tournée en cours', ['Position du véhicule', 'Progression des livraisons', 'Ajustements du parcours']],
    ],
  },
  {
    slug: 'stock-en-mouvement', product: 'WMS', title: 'Stock en mouvement',
    intro: 'Suivez les produits depuis la demande de stock jusqu’à leur réception. Les quantités, les réapprovisionnements et les produits endommagés restent identifiables.',
    audience: 'Clients, gestionnaires de stock et équipes de réception',
    result: 'Un inventaire consultable et des réceptions documentées pour préparer les prochaines commandes.',
    steps: [
      ['Créer les produits', 'Le client ajoute ses produits dans le WMS ou importe un fichier Excel selon le modèle fourni. Un produit existant peut être réapprovisionné en renseignant une quantité.', 'Catalogue produits', ['Référence produit', 'Quantité à ajouter', 'Import Excel disponible']],
      ['Envoyer une demande de stock', 'Le client prépare une demande de stock pour informer l’administrateur des produits à réceptionner. Cette demande peut ensuite être consultée et suivie.', 'Demande de stock', ['Produits concernés', 'Quantités demandées', 'Suivi de la demande']],
      ['Réceptionner les quantités', 'L’administrateur réalise une réception normale par entrepôt ou une réception globale. Il saisit les quantités reçues, les éventuels dommages et les emplacements.', 'Contrôle de réception', ['Quantités reçues', 'Quantités endommagées', 'Allée et étagère']],
      ['Consulter l’inventaire', 'L’équipe consulte le stock, utilise les filtres disponibles et peut exporter l’inventaire en Excel. Les retours et les produits endommagés disposent également de sections de suivi.', 'Inventaire consultable', ['Filtres par magasin et statut', 'Export Excel', 'Suivi des retours et dommages']],
    ],
  },
  {
    slug: 'entrepots-maitrises', product: 'WMS', title: 'Entrepôts maîtrisés',
    intro: 'Donnez une place identifiable à chaque produit. Le WMS relie les réceptions et les quantités aux entrepôts et aux emplacements de stockage.',
    audience: 'Responsables d’entrepôt et opérateurs logistiques',
    result: 'Des produits localisés et un stock lisible par entrepôt pour faciliter le travail de préparation.',
    steps: [
      ['Choisir l’entrepôt', 'Lors de la réception normale, l’opérateur sélectionne l’entrepôt puis le magasin concerné. Les produits à recevoir sont ensuite présentés pour traitement.', 'Contexte de réception', ['Entrepôt sélectionné', 'Magasin concerné', 'Liste des produits']],
      ['Contrôler les produits', 'Les quantités réellement reçues sont saisies. Les unités endommagées peuvent être renseignées séparément lors du contrôle.', 'Contrôle des quantités', ['Produits reçus', 'Quantités vérifiées', 'Dommages identifiés']],
      ['Attribuer les emplacements', 'L’opérateur choisit l’allée et l’étagère de stockage pour les produits réceptionnés. L’emplacement accompagne les informations de réception.', 'Localisation du stock', ['Entrepôt', 'Allée', 'Étagère']],
      ['Retrouver le stock', 'Les listes de produits et l’inventaire permettent de consulter les informations et de filtrer les résultats. Les références produits peuvent être exportées sous forme de codes-barres PDF.', 'Consultation des produits', ['Inventaire filtrable', 'Références produits', 'Export de codes-barres']],
    ],
  },
  {
    slug: 'flotte-et-chauffeurs', product: 'TMS', title: 'Flotte et chauffeurs',
    intro: 'Rassemblez vos véhicules, vos chauffeurs et leurs missions dans un même environnement. Gardez une vue sur les positions, l’activité et la maintenance de la flotte.',
    audience: 'Gestionnaires de flotte, exploitants et chauffeurs',
    result: 'Des missions affectées et une visibilité sur les véhicules pour coordonner le travail sur le terrain.',
    steps: [
      ['Référencer les ressources', 'Les fiches véhicules regroupent leurs caractéristiques. Les profils chauffeurs permettent de suivre leurs informations et les documents associés.', 'Ressources de transport', ['Fiches véhicules', 'Profils chauffeurs', 'Documents et certifications']],
      ['Répartir les missions', 'Les livraisons sont affectées aux chauffeurs et aux véhicules. La planification tient compte de la disponibilité et de la charge de travail.', 'Affectation des missions', ['Disponibilité', 'Charge de travail', 'Tournée attribuée']],
      ['Suivre les véhicules', 'La carte GPS permet de consulter la position des véhicules et leur état : à l’arrêt, en déplacement ou inactifs. Les alertes de zone et l’historique des trajets complètent le suivi.', 'Vue de la flotte', ['Localisation GPS', 'État du véhicule', 'Historique et alertes de zone']],
      ['Piloter l’entretien', 'Le suivi de maintenance rassemble les interventions et leur historique. Les rapports de consommation et d’utilisation aident à analyser l’activité de chaque véhicule.', 'Suivi de maintenance', ['Interventions planifiées', 'Historique d’entretien', 'Consommation et utilisation']],
    ],
  },
  {
    slug: 'preparation-rapide', product: 'WMS', title: 'Préparation rapide',
    intro: 'Transformez les produits réceptionnés en colis prêts à expédier. Les espaces client et administrateur accompagnent la création des colis, la préparation et les bons de livraison.',
    audience: 'Clients et équipes de préparation en entrepôt',
    result: 'Des colis préparés avec leurs produits et un bon de livraison pour accompagner leur expédition.',
    steps: [
      ['Créer le colis', 'Après réception des produits en entrepôt, le client crée un colis et renseigne ses informations. Un import Excel permet également de créer des colis en masse.', 'Colis à préparer', ['Informations du colis', 'Produits réceptionnés', 'Import Excel disponible']],
      ['Ajouter les articles', 'Le client sélectionne les produits à intégrer au colis et ajoute les quantités nécessaires. La fiche du colis rassemble les articles à préparer.', 'Composition du colis', ['Produits sélectionnés', 'Quantités par produit', 'Fiche du colis']],
      ['Préparer en entrepôt', 'L’administrateur consulte les préparations par client et les colis à traiter. Les opérateurs réalisent la préparation à partir des produits et quantités demandés.', 'Préparation par client', ['Liste des colis', 'Articles à prélever', 'Quantités à préparer']],
      ['Établir le bon de livraison', 'Le client crée un bon de livraison, sélectionne les colis concernés et enregistre le document. L’administrateur peut consulter les bons et les exporter en PDF.', 'Bon de livraison', ['Colis sélectionnés', 'Document enregistré', 'Export PDF']],
    ],
  },
  {
    slug: 'livraisons-documentees', product: 'TMS', title: 'Livraisons documentées',
    intro: 'Accompagnez le chauffeur jusqu’à la remise du colis. Son application mobile rassemble la navigation, les informations de commande et la capture des preuves de livraison.',
    audience: 'Chauffeurs, équipes transport et service client',
    result: 'Une livraison accompagnée d’une preuve et d’un historique consultable pour les équipes.',
    steps: [
      ['Consulter la mission', 'Le chauffeur retrouve sa tournée et les détails des commandes dans son application mobile. Les informations de contact client accompagnent chaque livraison.', 'Mission du chauffeur', ['Tournée du jour', 'Détails de commande', 'Contact du destinataire']],
      ['Rejoindre le destinataire', 'La navigation guide le chauffeur sur sa tournée. Le suivi GPS et les mises à jour de livraison donnent de la visibilité à l’équipe transport.', 'Livraison en cours', ['Navigation', 'Position GPS', 'Communication client']],
      ['Enregistrer la preuve', 'À la remise du colis, le chauffeur peut capturer une signature, prendre une photo ou ajouter une note depuis son application.', 'Preuve de livraison', ['Signature du destinataire', 'Photo de livraison', 'Note du chauffeur']],
      ['Consulter l’historique', 'Le statut et l’historique permettent de retrouver la progression de la commande. Les rapports servent à analyser les résultats des livraisons.', 'Livraison documentée', ['Statut actualisé', 'Historique de livraison', 'Rapports de performance']],
    ],
  },
]
