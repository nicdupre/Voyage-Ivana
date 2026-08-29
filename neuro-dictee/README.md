# Dictée neuro

Outil autonome (un seul fichier HTML) pour générer une note de consultation en
neurologie organisée par sections, prête à coller dans Crystalnet ou à envoyer
en pièce jointe par courriel.

Aucun serveur, aucune base de données, aucune dépendance : tout tourne dans
l'onglet du navigateur.

## Utiliser l'outil

- **Le plus simple** : double-cliquez sur `index.html` pour l'ouvrir dans
  Chrome ou Edge.
- Si le micro ne fonctionne pas en ouverture directe (certains navigateurs
  bloquent l'accès au micro pour les fichiers ouverts en `file://`), servez le
  dossier localement, par exemple :
  ```bash
  npx serve neuro-dictee
  ```
  puis ouvrez l'URL locale affichée (`http://localhost:...`).
- L'outil peut aussi être déposé tel quel sur n'importe quel hébergement
  statique (GitHub Pages, Vercel, etc.) si vous voulez y accéder depuis
  plusieurs appareils — il reste sans backend, donc sans risque de stockage
  centralisé de données de patients.

## Fonctionnement

1. Remplissez les champs d'identification (optionnels).
2. Pour chaque section (Motif, HMA, Antécédents, Médication/allergies, Examen
   neurologique, Impression, Plan), cliquez sur **🎙 Dicter** et parlez, ou
   écrivez/collez directement dans la zone de texte.
3. Cliquez sur **Générer la note** : le texte structuré apparaît en bas.
4. **Copier** pour coller dans Crystalnet, ou **Télécharger .txt** pour joindre
   le fichier à un courriel.
5. Rien n'est sauvegardé : fermer ou actualiser la page efface tout.

## Améliorer la qualité de la transcription

La reconnaissance vocale du navigateur est un moteur généraliste : elle
connaît mal le vocabulaire médical (médicaments, termes neuro) et fera des
erreurs récurrentes sur les mêmes mots. Deux leviers :

- **Dictionnaire de correction automatique** (carte dédiée dans l'outil) :
  ajoutez chaque mot mal transcrit et sa bonne orthographe (ex. « céfalée » →
  « céphalée », ou une expression mal comprise → un nom de médicament). La
  correction s'applique automatiquement pendant la dictée et à la génération
  de la note. Cette liste est sauvegardée dans le navigateur (uniquement des
  mots, jamais de données de patient) et reste disponible d'une session à
  l'autre — contrairement au reste du contenu.
- **Langue de dictée** : essayez de basculer entre Français (Canada) et
  Français (France) dans le menu déroulant ; l'un des deux comprend parfois
  mieux un accent donné.

Le texte dicté reste de toute façon éditable manuellement avant de générer
la note.

## Confidentialité — à lire avant d'utiliser avec de vrais patients

- Cette page elle-même n'envoie rien à aucun serveur.
- **Mais** le bouton micro utilise la reconnaissance vocale intégrée du
  navigateur, qui transmet l'audio capté aux serveurs de Google (Chrome) ou
  Microsoft (Edge) pour le transcrire. Ce n'est donc **pas** un traitement
  100 % local dès que vous dictez au micro.
- Si la politique de confidentialité de votre établissement l'exige :
  - évitez de dicter le nom du patient ou d'autres identifiants directs à
    voix haute (utilisez plutôt le numéro de dossier interne dans le champ
    prévu, ou laissez-le vide) ;
  - ou saisissez/collez le texte manuellement dans les sections au lieu
    d'utiliser le micro — la saisie manuelle ne quitte jamais la page.
- Relisez toujours le texte généré avant de l'utiliser au dossier : la
  reconnaissance vocale peut faire des erreurs, et cet outil n'est pas un
  dispositif médical certifié — la responsabilité clinique du contenu
  demeure celle du médecin.

## Compatibilité navigateur

La dictée vocale nécessite un navigateur basé sur Chromium (Chrome, Edge).
Firefox et Safari ne supportent pas l'API de reconnaissance vocale utilisée
ici : la saisie/le collage manuel restent disponibles dans tous les cas.

## Modifier le modèle de sections

Les sections sont définies au début du `<script>` dans `index.html`, dans le
tableau `SECTIONS` (id, titre, texte d'aide). Ajoutez, renommez ou réordonnez
les entrées pour adapter le modèle à vos besoins — l'ordre du tableau est
l'ordre dans la note générée.
