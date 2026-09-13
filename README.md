# Grow Logistics — Site 2

Landing page React/Vite présentant les deux solutions SaaS documentées dans les rapports du projet :

- **TMS** : planification des tournées, gestion de flotte, suivi GPS et preuves de livraison.
- **WMS** : gestion des stocks et opérations d'entrepôt.

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir l'adresse indiquée par Vite (habituellement `http://localhost:5173`).

## Vérifications

```bash
npm run lint
npm run build
```

Le build de production est généré dans `dist/`.

## Design de référence

La landing page reprend la composition du visuel Transit fourni : photographie maritime découpée en courbes, typographie Poppins et navigation par icônes. La palette a été remplacée par les cinq couleurs fournies : Cobalt Blue `#2457FF`, Deep Navy `#111C44`, Cream White `#F8F1E4`, Pale Sky `#D8E3FF` et Sand Gray `#B7AD9E`. Les textes sont adaptés à TMS et WMS. Sur mobile, la photographie passe sous le texte pour préserver sa lisibilité.

Les tokens de couleur sont centralisés dans `src/palette.css` (importé après les styles de structure). Les graphiques, les tracés sur la carte, les formulaires et les états interactifs utilisent ces variables. Le hero conserve la photo d’origine dans une fenêtre SVG avec des formes bleues éditables (`HeroArtwork.jsx`) ; le cadre de la photo circulaire est dessiné en CSS. Les images source sont conservées. Les tons de texte secondaires sont dérivés de la palette pour conserver leur lisibilité.

Modifier les fichiers de `src/`, puis lancer `npm run build` pour actualiser `dist/`. Ne pas modifier directement les fichiers générés dans `dist/`.

Les fichiers `public/assets/transit-banner.png` et `public/assets/transit-about.png` proviennent du [template Transit de HTML Design](https://html.design/download/logistic-service-website-template/), proposé sous licence [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). Le design est adapté et le crédit figure également dans le pied de page. Le logo Grow est un SVG créé pour cette adaptation.

## Interactions et limites

### Parcours interactif d’un colis

La section `#parcours`, située entre la présentation et les solutions, reprend le principe de narration au défilement observé sur [Shipsy](https://www.shipsy.ai/). Son implémentation et ses visuels sont propres au projet.

- Sur un écran d’au moins 901 × 680 px, la scène reste fixe pendant cinq hauteurs d’écran de défilement. Les sept étapes et le trajet évoluent avec le scroll, dans les deux sens.
- Les points de la chronologie, les boutons précédent/suivant et les touches fléchées permettent aussi de naviguer. Un lien permet de passer directement aux solutions.
- Sur mobile, écran court ou avec `prefers-reduced-motion`, la section fonctionne en navigation manuelle, sans longue zone de défilement.
- Carte réelle de Casablanca avec Leaflet et les tuiles OpenStreetMap, chargées lorsque la section approche du viewport. Une connexion Internet est nécessaire pour le fond de carte ; un message et un bouton de nouvelle tentative sont affichés en cas d’échec.
- Zoom +/− et bouton de recentrage. Le zoom à la molette est désactivé pour conserver le défilement narratif. Sur appareil mobile, le déplacement tactile est également désactivé pour laisser défiler la page.
- Le tracé routier est enregistré dans `src/data/casablanca-route.json`, calculé avec OSRM à partir des données OpenStreetMap. Le point se déplace le long des routes via `requestAnimationFrame`, sans appel à une API d’itinéraire pendant la visite. Les deux emplacements sont fictifs ; ils ne représentent ni un entrepôt Grow Logistics ni un client réel.
- Attribution OpenStreetMap visible. Le navigateur respecte le cache HTTP et envoie son Referer ; aucune prélecture ni téléchargement hors ligne des tuiles. Pour un site à fort trafic, choisir un fournisseur de tuiles adapté suivant la [politique OpenStreetMap](https://operations.osmfoundation.org/policies/tiles/) ; le service communautaire n’offre pas de SLA. L’URL du fournisseur est définie dans `JourneyMap.jsx`.
- Les fiches, échanges et montants illustrent les fonctions décrites dans les PDF. Le parcours est une démonstration, pas un suivi GPS réel, une intégration opérationnelle entre les produits ou un système d’agents IA.

Fichiers : `src/components/LogisticsJourney.jsx`, `src/components/LogisticsJourney.css`, `src/components/JourneyMap.jsx`, `src/components/JourneyMap.css` et `src/data/casablanca-route.json`.

### Autres interactions

- Trois présentations sélectionnables avec les points du hero, également accessibles avec les flèches du clavier.
- Menu et recherche dans une boîte de dialogue, fermable avec Échap.
- Sélection TMS / WMS et période du tableau de bord. Les chiffres affichés dans les maquettes sont illustratifs.
- Le formulaire valide les champs puis télécharge un récapitulatif texte local. Il ne transmet aucune donnée et ne réserve pas de rendez-vous ; connecter un service de contact pour un usage en production.

## Sources du contenu

- `Transforming-Logistics-Introducing-Our-Advanced-TMS (6).pdf` : transport, tournées, chauffeurs, flotte, suivi GPS, application mobile, preuves de livraison et rapports.
- `WMS - PDF.pdf` : réception, inventaire, emplacements, préparation, bons de livraison, retours et espaces client / administrateur. Le guide porte le nom SysColis ; le site présente ces fonctions sous l’intitulé WMS.
- `report-p2m-growmax.pdf` : rapport d’un projet technique distinct. GrowMax n’est pas un produit ni une marque affiliée à Grow Logistics ; ses fonctions spécifiques COD, WhatsApp et validation du téléphone ne sont pas attribuées au TMS.

Les chiffres des maquettes et le parcours sont illustratifs, sans connexion aux systèmes métier.

## Pages fonctionnalités

Les six cartes ouvrent une page dédiée sous `/fonctionnalites/<slug>`. Chaque page présente la fonctionnalité, ses utilisateurs, quatre étapes sélectionnables et le résultat du processus. Les descriptions sont centralisées dans `src/data/featureDetails.js` ; le composant commun est `src/components/FeaturePage.jsx`.

Les chemins directs fonctionnent avec Vite. En hébergement statique, configurer le repli des URL vers `index.html` pour permettre le rafraîchissement et l’ouverture directe de ces pages.

## Animations

Quatre effets sont définis dans `src/motion.css` et `src/hooks/useSiteMotion.js` : titres à apparition décalée, révélations au défilement, micro-interactions au pointeur, transitions natives entre documents. Ces dernières dépendent du support navigateur ; la navigation classique reste disponible. Les effets respectent `prefers-reduced-motion`, et les interactions au pointeur sont réservées à la souris. Les sections restent visibles si JavaScript ne les initialise pas.

Dix effets supplémentaires (`extra-motion.css`, `useExtraMotion.js`, `AnimatedNumber.jsx`) : progression de lecture, profondeur du fond vidéo, compteurs KPI, croissance des histogrammes, dessin de la courbe, rotation d’entrée des maquettes TMS/WMS, transition des aperçus d’étapes, confirmations séquentielles, focus des champs et soulignement des liens. Les animations ponctuelles se terminent automatiquement ; les compteurs conservent leur valeur finale accessible et réagissent au changement de période.

## Défilement de l’accueil

L’accueil utilise le défilement vertical natif. Les sections se succèdent de haut en bas, avec les animations visuelles et les liens d’ancrage. Le parcours du colis retrouve sa progression au défilement sur grand écran et ses commandes manuelles sur mobile ou avec réduction des mouvements.

## Présentation animée GSAP

La section `#logistique-en-mouvement`, après « À propos », adapte le principe visuel de « Animate Anything » sur [gsap.com](https://gsap.com/) : étiquettes superposées, formes en dégradé, rotations et scène horizontale locale au défilement. Les formes sont créées dans `LogisticsMotion.jsx` et `LogisticsMotion.css` ; aucun média du site de référence n’est importé.

Les trois scènes présentent Grow Logistics, le WMS (réception, emplacements, préparation et bons de livraison — guide WMS, pages 2–4, 13 et 31–38), puis le TMS (planification, affectations, GPS et preuve de livraison — présentation TMS, pages 4–5, 11 et 26–27). Le rapport GrowMax reste un projet distinct.

GSAP ScrollTrigger anime uniquement cette section sur grand écran. Le reste du site conserve le défilement vertical. Sur mobile ou écran court, les trois scènes sont empilées ; avec réduction des mouvements, tout le contenu reste statique et lisible. Les boutons de scène et liens de sortie permettent de naviguer au clavier.
# growlogistics
# growlogistics
