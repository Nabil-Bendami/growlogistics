import { t } from '../i18n/index.js'
export const featureDetails = [
  {
    slug: 'tournees-optimisees', product: 'TMS', title: t("Tournées optimisées"),
    intro: t("Construisez des tournées adaptées à vos commandes, à vos véhicules et aux horaires de vos clients. Le planning rassemble les contraintes avant le départ."),
    audience: t("Responsables transport et équipes de planification"),
    result: t("Une tournée ordonnée, affectée à un chauffeur et à un véhicule, avec les informations nécessaires pour prendre la route."),
    steps: [
      [t("Rassembler les livraisons"), t("Les commandes à livrer sont centralisées avec leurs destinations et leurs créneaux horaires. Le planificateur dispose des informations nécessaires pour organiser les arrêts."), t("Commandes à planifier"), [t("Adresses de livraison"), t("Créneaux horaires"), t("Volumes et poids")]],
      [t("Construire l’itinéraire"), t("Le TMS organise les arrêts en tenant compte des capacités des véhicules et des contraintes de livraison. Les outils d’optimisation permettent de limiter les distances et les temps de trajet."), t("Organisation des arrêts"), [t("Séquence des destinations"), t("Capacité du véhicule"), t("Contraintes horaires")]],
      [t("Affecter les ressources"), t("La tournée est affectée à un chauffeur et à un véhicule disponibles. Le planning permet de consulter les affectations et d’ajuster l’organisation."), t("Tournée affectée"), [t("Chauffeur sélectionné"), t("Véhicule affecté"), t("Planning de départ")]],
      [t("Suivre et ajuster"), t("Pendant la tournée, le suivi des véhicules et des statuts donne de la visibilité à l’équipe. Les outils de planification permettent d’adapter le parcours aux imprévus."), t("Tournée en cours"), [t("Position du véhicule"), t("Progression des livraisons"), t("Ajustements du parcours")]],
    ],
  },
  {
    slug: 'stock-en-mouvement', product: 'WMS', title: t("Stock en mouvement"),
    intro: t("Suivez les produits depuis la demande de stock jusqu’à leur réception. Les quantités, les réapprovisionnements et les produits endommagés restent identifiables."),
    audience: t("Clients, gestionnaires de stock et équipes de réception"),
    result: t("Un inventaire consultable et des réceptions documentées pour préparer les prochaines commandes."),
    steps: [
      [t("Créer les produits"), t("Le client ajoute ses produits dans le WMS ou importe un fichier Excel selon le modèle fourni. Un produit existant peut être réapprovisionné en renseignant une quantité."), t("Catalogue produits"), [t("Référence produit"), t("Quantité à ajouter"), t("Import Excel disponible")]],
      [t("Envoyer une demande de stock"), t("Le client prépare une demande de stock pour informer l’administrateur des produits à réceptionner. Cette demande peut ensuite être consultée et suivie."), t("Demande de stock"), [t("Produits concernés"), t("Quantités demandées"), t("Suivi de la demande")]],
      [t("Réceptionner les quantités"), t("L’administrateur réalise une réception normale par entrepôt ou une réception globale. Il saisit les quantités reçues, les éventuels dommages et les emplacements."), t("Contrôle de réception"), [t("Quantités reçues"), t("Quantités endommagées"), t("Allée et étagère")]],
      [t("Consulter l’inventaire"), t("L’équipe consulte le stock, utilise les filtres disponibles et peut exporter l’inventaire en Excel. Les retours et les produits endommagés disposent également de sections de suivi."), t("Inventaire consultable"), [t("Filtres par magasin et statut"), 'Export Excel', t("Suivi des retours et dommages")]],
    ],
  },
  {
    slug: 'entrepots-maitrises', product: 'WMS', title: t("Entrepôts maîtrisés"),
    intro: t("Donnez une place identifiable à chaque produit. Le WMS relie les réceptions et les quantités aux entrepôts et aux emplacements de stockage."),
    audience: t("Responsables d’entrepôt et opérateurs logistiques"),
    result: t("Des produits localisés et un stock lisible par entrepôt pour faciliter le travail de préparation."),
    steps: [
      [t("Choisir l’entrepôt"), t("Lors de la réception normale, l’opérateur sélectionne l’entrepôt puis le magasin concerné. Les produits à recevoir sont ensuite présentés pour traitement."), t("Contexte de réception"), [t("Entrepôt sélectionné"), t("Magasin concerné"), t("Liste des produits")]],
      [t("Contrôler les produits"), t("Les quantités réellement reçues sont saisies. Les unités endommagées peuvent être renseignées séparément lors du contrôle."), t("Contrôle des quantités"), [t("Produits reçus"), t("Quantités vérifiées"), t("Dommages identifiés")]],
      [t("Attribuer les emplacements"), t("L’opérateur choisit l’allée et l’étagère de stockage pour les produits réceptionnés. L’emplacement accompagne les informations de réception."), t("Localisation du stock"), [t("Entrepôt"), t("Allée"), t("Étagère")]],
      [t("Retrouver le stock"), t("Les listes de produits et l’inventaire permettent de consulter les informations et de filtrer les résultats. Les références produits peuvent être exportées sous forme de codes-barres PDF."), t("Consultation des produits"), [t("Inventaire filtrable"), t("Références produits"), t("Export de codes-barres")]],
    ],
  },
  {
    slug: 'flotte-et-chauffeurs', product: 'TMS', title: t("Flotte et chauffeurs"),
    intro: t("Rassemblez vos véhicules, vos chauffeurs et leurs missions dans un même environnement. Gardez une vue sur les positions, l’activité et la maintenance de la flotte."),
    audience: t("Gestionnaires de flotte, exploitants et chauffeurs"),
    result: t("Des missions affectées et une visibilité sur les véhicules pour coordonner le travail sur le terrain."),
    steps: [
      [t("Référencer les ressources"), t("Les fiches véhicules regroupent leurs caractéristiques. Les profils chauffeurs permettent de suivre leurs informations et les documents associés."), t("Ressources de transport"), [t("Fiches véhicules"), t("Profils chauffeurs"), t("Documents et certifications")]],
      [t("Répartir les missions"), t("Les livraisons sont affectées aux chauffeurs et aux véhicules. La planification tient compte de la disponibilité et de la charge de travail."), t("Affectation des missions"), [t("Disponibilité"), t("Charge de travail"), t("Tournée attribuée")]],
      [t("Suivre les véhicules"), t("La carte GPS permet de consulter la position des véhicules et leur état : à l’arrêt, en déplacement ou inactifs. Les alertes de zone et l’historique des trajets complètent le suivi."), t("Vue de la flotte"), [t("Localisation GPS"), t("État du véhicule"), t("Historique et alertes de zone")]],
      [t("Piloter l’entretien"), t("Le suivi de maintenance rassemble les interventions et leur historique. Les rapports de consommation et d’utilisation aident à analyser l’activité de chaque véhicule."), t("Suivi de maintenance"), [t("Interventions planifiées"), t("Historique d’entretien"), t("Consommation et utilisation")]],
    ],
  },
  {
    slug: 'preparation-rapide', product: 'WMS', title: t("Préparation rapide"),
    intro: t("Transformez les produits réceptionnés en colis prêts à expédier. Les espaces client et administrateur accompagnent la création des colis, la préparation et les bons de livraison."),
    audience: t("Clients et équipes de préparation en entrepôt"),
    result: t("Des colis préparés avec leurs produits et un bon de livraison pour accompagner leur expédition."),
    steps: [
      [t("Créer le colis"), t("Après réception des produits en entrepôt, le client crée un colis et renseigne ses informations. Un import Excel permet également de créer des colis en masse."), t("Colis à préparer"), [t("Informations du colis"), t("Produits réceptionnés"), t("Import Excel disponible")]],
      [t("Ajouter les articles"), t("Le client sélectionne les produits à intégrer au colis et ajoute les quantités nécessaires. La fiche du colis rassemble les articles à préparer."), t("Composition du colis"), [t("Produits sélectionnés"), t("Quantités par produit"), t("Fiche du colis")]],
      [t("Préparer en entrepôt"), t("L’administrateur consulte les préparations par client et les colis à traiter. Les opérateurs réalisent la préparation à partir des produits et quantités demandés."), t("Préparation par client"), [t("Liste des colis"), t("Articles à prélever"), t("Quantités à préparer")]],
      [t("Établir le bon de livraison"), t("Le client crée un bon de livraison, sélectionne les colis concernés et enregistre le document. L’administrateur peut consulter les bons et les exporter en PDF."), t("Bon de livraison"), [t("Colis sélectionnés"), t("Document enregistré"), 'Export PDF']],
    ],
  },
  {
    slug: 'livraisons-documentees', product: 'TMS', title: t("Livraisons documentées"),
    intro: t("Accompagnez le chauffeur jusqu’à la remise du colis. Son application mobile rassemble la navigation, les informations de commande et la capture des preuves de livraison."),
    audience: t("Chauffeurs, équipes transport et service client"),
    result: t("Une livraison accompagnée d’une preuve et d’un historique consultable pour les équipes."),
    steps: [
      [t("Consulter la mission"), t("Le chauffeur retrouve sa tournée et les détails des commandes dans son application mobile. Les informations de contact client accompagnent chaque livraison."), t("Mission du chauffeur"), [t("Tournée du jour"), t("Détails de commande"), t("Contact du destinataire")]],
      [t("Rejoindre le destinataire"), t("La navigation guide le chauffeur sur sa tournée. Le suivi GPS et les mises à jour de livraison donnent de la visibilité à l’équipe transport."), t("Livraison en cours"), ['Navigation', t("Position GPS"), t("Communication client")]],
      [t("Enregistrer la preuve"), t("À la remise du colis, le chauffeur peut capturer une signature, prendre une photo ou ajouter une note depuis son application."), t("Preuve de livraison"), [t("Signature du destinataire"), t("Photo de livraison"), t("Note du chauffeur")]],
      [t("Consulter l’historique"), t("Le statut et l’historique permettent de retrouver la progression de la commande. Les rapports servent à analyser les résultats des livraisons."), t("Livraison documentée"), [t("Statut actualisé"), t("Historique de livraison"), t("Rapports de performance")]],
    ],
  },
]
