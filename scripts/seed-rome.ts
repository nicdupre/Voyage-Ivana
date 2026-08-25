/**
 * One-off loader for the "Rome — Nicolas & Ivana" trip.
 * Source: uploaded rome_complet.html (detailed itinerary + budget prepared ahead of time).
 * Run with: npx tsx scripts/seed-rome.ts
 */
import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { generateInviteCode, colorForIndex } from "../src/lib/codes";

const TRIP_NAME = "Rome — Nicolas & Ivana";

type ItineraryInput = {
  date: string; // YYYY-MM-DD
  time: string | null;
  title: string;
  location?: string | null;
  notes?: string | null;
};

const YEAR = 2026;

const itinerary: ItineraryInput[] = [
  // ── Sam 28 nov. — Départ Québec ──
  {
    date: `${YEAR}-11-28`,
    time: null,
    title: "🎭 Thème du jour",
    notes:
      "Nicolas — YQB → Rome FCO. Le voyage commence par Rome telle qu'elle se raconte à elle-même — Cinecittà (1937), usines à mythes qui ont recréé l'Antiquité sur pellicule, avant d'aller la voir en pierre.",
  },
  {
    date: `${YEAR}-11-28`,
    time: "10:30",
    title: "Arrivée aéroport YQB",
    notes: "Nicolas · Logistique. Enregistrement 2h avant · 1er bagage : 180 $ CA (tarif Basic).",
  },
  {
    date: `${YEAR}-11-28`,
    time: "12:45",
    title: "Décollage YQB → Rome FCO",
    notes: "Nicolas · Vol Air Canada · 1 escale · 13h10 de voyage total. Coût estimé : ~1200 $ CA (A/R).",
  },
  {
    date: `${YEAR}-11-28`,
    time: null,
    title: "Nuit en vol ✈️",
    notes: "Arrivée Rome le lendemain 7h55.",
  },

  // ── Dim 29 nov. — Arrivées · Cinecittà ──
  {
    date: `${YEAR}-11-29`,
    time: null,
    title: "🎭 Thème du jour",
    notes:
      "Nicolas seul le matin · Ivana arrive en PM. Premier contact avec la Rome impériale (Ier–IVe s.) · Forum, Palatine, Colisée — la ville à son apogée, spectacles de masse, puissance absolue.",
  },
  {
    date: `${YEAR}-11-29`,
    time: "07:55",
    title: "Atterrissage FCO · Leonardo Express → Termini",
    notes: "Nicolas · Arrivée. Train FCO → Termini : 32 min, 14 €. Taxi Termini → hôtel : ~8 €. Coût total : ~22 €.",
  },
  {
    date: `${YEAR}-11-29`,
    time: "09:00",
    title: "Dépôt des bagages · Condominio Monti Boutique Hotel",
    location: "Via dei Serpenti 109–110, Monti",
    notes: "Nicolas · Service gratuit, check-in officiel en PM à son retour.",
  },
  {
    date: `${YEAR}-11-29`,
    time: "09:10",
    title: "Acheter passe CIS 7 jours",
    location: "Tabaccaio, Via dei Serpenti",
    notes:
      "Nicolas (+ Ivana à Termini ~15h15) · 24 € · valide jusqu'au 5 déc. minuit. Couvre métro/bus/tram toute la semaine. Coût : N 24 €, I 24 €.",
  },
  {
    date: `${YEAR}-11-29`,
    time: "09:20",
    title: "Départ pour Cinecittà",
    notes: "Nicolas · Métro A → station Cinecittà, 25 min direct. Coût : 3 € (A/R).",
  },
  {
    date: `${YEAR}-11-29`,
    time: "10:00",
    title: "Cinecittà — Studios & Felliniana",
    location: "Cinecittà",
    notes:
      "Nicolas · Ouvert dès 10h, fermé le mardi, entrée ~10 €. À voir : Felliniana (Palazzina Fellini, Dante Ferretti), MIAC (Musée de l'Audiovisuel), set de Rome Antique (4 ha, HBO), Cinecittà si Mostra — costumes et décors depuis 1937. Jusqu'à 12h30.",
  },
  {
    date: `${YEAR}-11-29`,
    time: "13:00",
    title: "Retour à l'hôtel · Check-in · Installation en chambre",
    notes:
      "Nicolas · Métro A → Termini (passe CIS), taxi Termini → hôtel (5 min). Bagages déposés le matin — chambre dispo ou livrée à l'arrivée.",
  },
  {
    date: `${YEAR}-11-29`,
    time: "13:30",
    title: "Déjeuner · Monti",
    notes: "Nicolas · Trattoria de quartier, à pied depuis l'hôtel. Coût : ~22 €.",
  },
  {
    date: `${YEAR}-11-29`,
    time: "15:15",
    title: "Nicolas attend Ivana sur le quai · Roma Termini",
    notes:
      "Santhia → Roma Termini, Frecciarossa direct, ~5h45, départ matin. Doady conduit Ivana d'Ochieppo à la gare de Santhia. Ivana parle couramment l'italien — voyage autonome.",
  },
  {
    date: `${YEAR}-11-29`,
    time: "15:45",
    title: "Check-in hôtel · Chambres séparées",
    location: "Condominio Monti Boutique Hotel, Via dei Serpenti 109–110",
    notes: "Nicolas + Ivana · Coût : N ~145 €/nuit, I ~145 €/nuit.",
  },
  {
    date: `${YEAR}-11-29`,
    time: "19:30",
    title: "La Carbonara · Monti",
    notes: "Nicolas + Ivana · Trattoria à 5 min à pied, table réservée, repas léger. Coût : N ~33 €, I ~33 €.",
  },
  {
    date: `${YEAR}-11-29`,
    time: "20:00",
    title: "Ivana — bonne nuit 🌙",
  },
  {
    date: `${YEAR}-11-29`,
    time: "21:00",
    title: "Forum Romain & Colisée illuminés — Via dei Fori Imperiali",
    notes:
      "Nicolas (optionnel pour Ivana) · Marche nocturne, 5 min à pied depuis La Carbonara, 30–45 min, gratuit. Longer la Via dei Fori Imperiali côté forum — colonnes du Temple de Saturne, Arc de Titus, Basilique de Maxence, et au fond le Colisée baigné de lumière ambrée. Quasi personne. Aide à recaler l'horloge biologique après le vol.",
  },

  // ── Lun 30 nov. — Jour 1 ──
  {
    date: `${YEAR}-11-30`,
    time: null,
    title: "🎭 Thème du jour",
    notes:
      "Rome Antique · Forum & Colisée · Thermes de Caracalla PM. Cœur de l'Empire (Ier–IIIe s.) · le Forum sous la République tardive, le Colisée des Flaviens (80 apr. J.-C.), les Thermes de Caracalla (212) — trois siècles en une journée.",
  },
  {
    date: `${YEAR}-11-30`,
    time: "08:00",
    title: "Petit-déjeuner à l'hôtel",
    notes: "Inclus dans le tarif hôtelier. 8h précises.",
  },
  {
    date: `${YEAR}-11-30`,
    time: "09:00",
    title: "Forum Romain & Colline Palatine",
    notes:
      "Nicolas + Ivana · À pied depuis l'hôtel, 10 min. Billet combiné Forum + Colisée. Rythme lent, gradins disponibles. Entrer dès 9h. Réserver sur colosseo.it. Jusqu'à 11h. Coût : N+I 18 € chacun.",
  },
  {
    date: `${YEAR}-11-30`,
    time: "11:15",
    title: "Colisée",
    notes:
      "Nicolas + Ivana · Accès prioritaire, ascenseurs disponibles. Horaire hiver 8h30–16h30 (oct.–fév.). Inclus dans le billet combiné. Jusqu'à 12h45.",
  },
  {
    date: `${YEAR}-11-30`,
    time: "13:00",
    title: "Déjeuner · Hostaria Isidoro",
    location: "Via S. Giovanni in Laterano",
    notes: "13h précises. Coût : N ~22 €, I ~22 €.",
  },
  {
    date: `${YEAR}-11-30`,
    time: "14:30",
    title: "Thermes de Caracalla",
    location: "Via delle Terme di Caracalla",
    notes:
      "Nicolas + Ivana (optionnel pour Ivana) · Taxi depuis l'hôtel, 8 min. Ouvert le lundi. Guide privé disponible. Complexe thermal impérial du IIIe s. — 11 hectares, 1 600 baigneurs simultanés. Quasi désert en décembre, bancs nombreux. Réserver sur coopculture.it. Jusqu'à 16h15. Coût : N ~8 €, I ~8 €.",
  },
  {
    date: `${YEAR}-11-30`,
    time: "17:00",
    title: "Musées du Capitole",
    notes:
      "Nicolas + Ivana · Taxi depuis les Thermes, 8 min. La Louve, Marc-Aurèle, têtes colossales de Constantin. Jusqu'à 18h30. Coût : N+I 15 € chacun.",
  },
  {
    date: `${YEAR}-11-30`,
    time: "19:30",
    title: "La Carbonara · Monti",
    location: "Via della Madonna dei Monti 103",
    notes: "Table réservée. Coût : N ~33 €, I ~33 €.",
  },

  // ── Mar 1 déc. — Jour 2 ──
  {
    date: `${YEAR}-12-01`,
    time: null,
    title: "🎭 Thème du jour",
    notes:
      "Baroque · Navona & Trevi · Palazzo Valentini PM. Du Baroque (XVIIe s.) aux couches profondes · Navona et Trevi, le cœur vivant de la ville. Puis Palazzo Valentini : deux villas du IVe s. sous les pieds. La plongée vers l'Antiquité commence.",
  },
  {
    date: `${YEAR}-12-01`,
    time: "08:00",
    title: "Petit-déjeuner à l'hôtel",
    notes: "Inclus.",
  },
  {
    date: `${YEAR}-12-01`,
    time: "10:00",
    title: "Piazza Navona",
    notes:
      "Nicolas + Ivana · Taxi 12 min. Fontaine des Quatre-Fleuves du Bernin. Bancs disponibles. Café Sant'Eustachio sur le chemin — le meilleur café de Rome. Jusqu'à 12h. Coût : taxi ~12 € (partagé).",
  },
  {
    date: `${YEAR}-12-01`,
    time: "12:00",
    title: "Fontaine de Trevi",
    notes: "Nicolas + Ivana · 15 min à pied depuis Navona, entrée 2 €. Jusqu'à 12h45. Coût : N+I 2 € chacun.",
  },
  {
    date: `${YEAR}-12-01`,
    time: "13:00",
    title: "Déjeuner · Hostaria Grappolo d'Oro",
    notes: "Coût : N ~22 €, I ~22 €.",
  },
  {
    date: `${YEAR}-12-01`,
    time: "14:30",
    title: "Domus Romane di Palazzo Valentini",
    location: "Via Foro Traiano 84",
    notes:
      "Nicolas + Ivana (optionnel pour Ivana) · Taxi 12 min. Guide inclus, 90 min. Deux villas du IVe s., reconstruction multimédia de Piero Angela, entièrement assis. palazzovalentini.it. Jusqu'à 16h15. Coût : N ~12 €, I ~12 €, taxi ~12 € (partagé).",
  },
  {
    date: `${YEAR}-12-01`,
    time: "17:00",
    title: "Vittoriano — Altare della Patria",
    notes:
      "Nicolas + Ivana · 10 min à pied. Ascenseur panoramique 7 €, entrée base libre. Jusqu'à 18h30. Coût : N+I 7 € chacun.",
  },
  {
    date: `${YEAR}-12-01`,
    time: "19:30",
    title: "La Carbonara · Monti",
    location: "Via della Madonna dei Monti 103",
    notes: "Table réservée. Coût : N ~33 €, I ~33 €.",
  },
  {
    date: `${YEAR}-12-01`,
    time: "21:00",
    title: "Fontaine de Trevi + Panthéon de nuit",
    notes:
      "Nicolas + Ivana (optionnel) · Marche nocturne, taxi depuis Monti 10 min, 45–60 min, gratuit. Trevi la nuit : éclairage rasant sur les chevaux et dorures, eau turquoise, foule fine en décembre. Puis 15 min à pied vers le Panthéon — piazza vide, oculo éteint, colonnes corinthiennes dans la nuit. Le meilleur moment pour voir les deux.",
  },

  // ── Mer 2 déc. — Jour 3 ──
  {
    date: `${YEAR}-12-02`,
    time: null,
    title: "🎭 Thème du jour",
    notes:
      "Panthéon · Castel + San Clemente · Capucins · marche nocturne. Verticalité temporelle (IIe–XIIe s.) · Panthéon d'Hadrien (118–128), le Castel — mausolée transformé en forteresse médiévale, San Clemente en trois couches superposées : basilique romane (XIIe s.) sur basilique paléochrétienne (IVe s.) sur domus et mithraeum (Ier s.). Le temps se lit à la verticale.",
  },
  {
    date: `${YEAR}-12-02`,
    time: "08:00",
    title: "Petit-déjeuner à l'hôtel",
  },
  {
    date: `${YEAR}-12-02`,
    time: "10:00",
    title: "Panthéon",
    notes:
      "Nicolas + Ivana · Taxi 15 min. Entrée 5 €. direzionemuseiroma.cultura.gov.it. Jusqu'à 11h30. Coût : N+I 5 € chacun, taxi ~15 € (partagé).",
  },
  {
    date: `${YEAR}-12-02`,
    time: "12:30",
    title: "Armando al Pantheon",
    location: "Salita dei Crescenzi 31",
    notes:
      "Déjeuner. 2 min du Panthéon, réserver plusieurs semaines à l'avance. ⚠️ Repas complet — 5h30 d'écart jusqu'à la fin du spectacle du soir. Collation sucrée pour Ivana aux entractes. Coût : N ~22 €, I ~22 €.",
  },
  {
    date: `${YEAR}-12-02`,
    time: "14:00",
    title: "Castel Sant'Angelo",
    notes:
      "Nicolas + Ivana · Taxi 12 min. Mar–Dim 9h–19h30. coopculture.it. Montée par paliers, café-terrasse au sommet (vue Tibre/Vatican), traversée du Ponte Sant'Angelo (anges du Bernin). Jusqu'à 15h30. Coût : N+I 16 € chacun, taxi ~12 € (partagé).",
  },
  {
    date: `${YEAR}-12-02`,
    time: "15:45",
    title: "Basilique San Clemente",
    location: "Piazza di San Clemente",
    notes:
      "Nicolas + Ivana · Taxi depuis Castel, 10 min. Trois couches : XIIe s. · IVe s. · Ier s. Froid et humide en bas — prévoir une veste. Jusqu'à 17h15. Coût : N+I 10 € chacun, taxi ~10 € (partagé).",
  },
  {
    date: `${YEAR}-12-02`,
    time: "17:30",
    title: "Crypte des Capucins",
    notes:
      "Nicolas (+ Ivana si en forme) · Optionnel. Taxi San Clemente → Via Veneto, 12 min, ~45 min. 3 700 squelettes de moines en arabesques. Méditatif et baroque. Jusqu'à 18h30. Coût : N ~10 €, I ~10 € (optionnel), taxi ~12 € (partagé).",
  },
  {
    date: `${YEAR}-12-02`,
    time: "19:00",
    title: "Retour hôtel · Repos",
    notes: "Taxi retour ~12 min. Dîner 19h30.",
  },
  {
    date: `${YEAR}-12-02`,
    time: "19:30",
    title: "La Carbonara · Monti",
    location: "Via della Madonna dei Monti 103",
    notes: "Table réservée. Coût : N ~33 €, I ~33 €.",
  },

  // ── Jeu 3 déc. — Jour 4 · ★ Gonfalone ──
  {
    date: `${YEAR}-12-03`,
    time: null,
    title: "🎭 Thème du jour · ★ Gonfalone",
    notes:
      "Mithraeum PM · Gonfalone le soir. De l'Antiquité mystérieuse à la Renaissance sacrée (IIe s. → 1544) · le Mithraeum, culte à mystères qui rivalisa avec le christianisme. Le soir, l'Oratorio del Gonfalone — fresques de la Passion du Christ dans un joyau maniériste. Deux religions du salut, deux millénaires d'écart.",
  },
  {
    date: `${YEAR}-12-03`,
    time: "08:00",
    title: "Petit-déjeuner à l'hôtel",
  },
  {
    date: `${YEAR}-12-03`,
    time: "10:00",
    title: "Matinée libre",
    notes:
      "Quartier Monti · Flânerie · Via dei Serpenti · Mercato · Café San Calisto. Journée légère avant le concert du soir. Récupération, shopping, lecture. Jusqu'à 12h.",
  },
  {
    date: `${YEAR}-12-03`,
    time: "13:00",
    title: "Osteria dell'Angelo · Prati",
    location: "Via Bettolo 24",
    notes: "Déjeuner à la carte, 13h précises, table réservée. Coût : N ~22 €, I ~22 €.",
  },
  {
    date: `${YEAR}-12-03`,
    time: "14:00",
    title: "Mithraeum du Circus Maximus — Rome souterraine",
    location: "Viale Aventino",
    notes:
      "Nicolas (+ Ivana si en forme) · Visite guidée optionnelle. Taxi 12 min. Réserver sur romeguide.it (à confirmer — vérifier l'offre exacte avant de payer). Temple mithraïque du IIe s. enfoui sous les tribunes du Circus Maximus. Relief en marbre du taurobole. ~1h30, ~15–20 €/pers, accessible à Ivana (de plain-pied). Jusqu'à 16h. Coût : N ~18 €, I ~18 € (optionnel), taxi A/R ~24 € (partagé).",
  },
  {
    date: `${YEAR}-12-03`,
    time: "16:30",
    title: "Retour hôtel · Repos · Tenue de soirée",
    notes: "Taxi retour ~12 min. Dîner léger avant le concert — celui-ci commence à 20h30 et dure ~1h30.",
  },
  {
    date: `${YEAR}-12-03`,
    time: "19:45",
    title: "Départ · Oratorio del Gonfalone",
    location: "Via del Gonfalone 32",
    notes:
      "Nicolas + Ivana · Taxi 10 min, arrivée 20h. Arriver 30 min avant pour admirer les fresques maniéristes (1569–1576, Federico Zuccari).",
  },
  {
    date: `${YEAR}-12-03`,
    time: "20:30",
    title: "★ Concert — Oratorio del Gonfalone",
    location: "Via del Gonfalone 32, près de Campo de' Fiori",
    notes:
      "~1h30. Joyau Renaissance de 1544, fresques maniéristes couvrant tous les murs. Roma Bansuri Ensemble — orchestre de flûtes · Vivaldi (L'Inverno), Mozart, Ponchielli (Danse des Heures), Grieg (Suite Holberg), Rossini, Haendel, Strauss · Dir. Francesco Leonardi. ⚠️ Collation sucrée pour Ivana avant le départ (pas d'entracte habituel). Réserver : classictic.com ou info@oratoriogonfalone.eu, tél. 06 6875952, posto unico 30 €. Coût : N+I 30 € chacun, taxi ~10 € (partagé).",
  },
  {
    date: `${YEAR}-12-03`,
    time: "22:15",
    title: "Retour en taxi · Condominio Monti",
    notes: "~10 min. Collation légère si besoin. Coût : taxi ~10 € (partagé).",
  },

  // ── Ven 4 déc. — Jour 5 ──
  {
    date: `${YEAR}-12-04`,
    time: null,
    title: "🎭 Thème du jour",
    notes:
      "Renaissance · Vatican & Gianicolo · Doria Pamphilj. De la Renaissance au XVIIe s. · Saint-Pierre sur les fondations de Constantin, achevée par Michel-Ange et Bernin. Galleria Doria Pamphilj : collection princière du Seicento — Velázquez, Caravage, Titien. Trastevere : la Rome populaire inchangée depuis des siècles.",
  },
  {
    date: `${YEAR}-12-04`,
    time: "08:00",
    title: "Petit-déjeuner à l'hôtel",
  },
  {
    date: `${YEAR}-12-04`,
    time: "10:00",
    title: "Basilique Saint-Pierre",
    notes:
      "Nicolas + Ivana · Métro A → Ottaviano, 10 min depuis Termini, puis 12 min à pied. Intérieur uniquement, pas les musées, tenue couverte. Ivana peut s'asseoir dans la basilique pendant que Nicolas monte à la coupole (optionnel, 8 €). Passe CIS. Jusqu'à 12h. Coût : N 8 € (coupole).",
  },
  {
    date: `${YEAR}-12-04`,
    time: "13:00",
    title: "Osteria dell'Angelo · Prati",
    location: "Via Bettolo 24",
    notes: "Déjeuner à la carte, 13h précises, table réservée. Coût : N ~22 €, I ~22 €.",
  },
  {
    date: `${YEAR}-12-04`,
    time: "14:30",
    title: "Galleria Doria Pamphilj",
    location: "Via del Corso",
    notes:
      "Nicolas + Ivana (optionnel pour Ivana) · Taxi 12 min. Rythme libre, audioguide inclus (narré par le prince Jonathan Doria Pamphilj). Velázquez, Caravage, Titien, Bernin — salles quasi vides. Jusqu'à 16h30. Coût : N ~12 €, I ~12 €, taxi ~12 € (partagé).",
  },
  {
    date: `${YEAR}-12-04`,
    time: "16:30",
    title: "Trastevere & Terrasse du Gianicolo",
    notes:
      "Nicolas + Ivana · Taxi depuis Via del Corso, 15 min. Flânerie, coucher de soleil depuis le Gianicolo. Jusqu'à 18h. Coût : taxi ~15 € (partagé).",
  },
  {
    date: `${YEAR}-12-04`,
    time: "19:30",
    title: "Dîner d'adieu · Da Enzo al 29 · Trastevere",
    location: "Via dei Vascellari 29",
    notes:
      "Nicolas + Ivana · Taxi Gianicolo → Trastevere, 15 min, table réservée. Dernier grand dîner ensemble avant le départ du lendemain matin. Coût : N ~33 €, I ~33 €.",
  },
  {
    date: `${YEAR}-12-04`,
    time: "21:00",
    title: "Castel Sant'Angelo illuminé + Ponte Sant'Angelo",
    notes:
      "Nicolas (+ Ivana si en forme) · Marche nocturne, 10 min à pied depuis Prati, 30 min, gratuit, Nicolas seul. Le monument le plus spectaculaire de Rome la nuit — forteresse illuminée en ambre, anges du Bernin sur le pont, reflet dans le Tibre, vue sur Saint-Pierre au fond. Taxi retour depuis le pont. Ivana prépare ses bagages pendant ce temps.",
  },
  {
    date: `${YEAR}-12-04`,
    time: "21:30",
    title: "Ivana rentre à l'hôtel · Prépare ses bagages",
    notes: "Taxi Prati → hôtel, 5 min. Billet train en main. Commander taxi itTaxi pour 8h45.",
  },

  // ── Sam 5 déc. — Départs ──
  {
    date: `${YEAR}-12-05`,
    time: null,
    title: "🎭 Thème du jour",
    notes: "Nicolas → Québec · Ivana → Santhia.",
  },
  {
    date: `${YEAR}-12-05`,
    time: "07:00",
    title: "Petit-déjeuner à l'hôtel",
    notes: "7h précises. Repas complet avant le long trajet d'Ivana.",
  },
  {
    date: `${YEAR}-12-05`,
    time: "08:00",
    title: "Check-out · Taxi hôtel → Fiumicino FCO",
    notes: "Nicolas · 35–40 min, être à FCO avant 9h15. Coût : N 55 € (tarif fixe).",
  },
  {
    date: `${YEAR}-12-05`,
    time: "08:45",
    title: "Taxi hôtel → Roma Termini",
    notes: "Ivana · Pré-réservé la veille via itTaxi, ~15 min. Coût : I ~8 €.",
  },
  {
    date: `${YEAR}-12-05`,
    time: "09:25",
    title: "Roma Termini → Santhia",
    notes:
      "Ivana · Frecciarossa direct, classe Business/Prima, ~5h45. Doady vient chercher Ivana à la gare de Santhia, arrivée prévue ~15h30. Coût : I ~70 €.",
  },
  {
    date: `${YEAR}-12-05`,
    time: "11:15",
    title: "Décollage FCO → Québec YQB",
    notes: "Nicolas · Air Canada, 1 escale, 15h16, arrivée 20h31. Coût : N ~1200 $ CA (retour inclus dans A/R).",
  },
  {
    date: `${YEAR}-12-05`,
    time: "14:30",
    title: "Arrivée Santhia · Doady attend 🏡",
    notes: "Ivana.",
  },
  {
    date: `${YEAR}-12-05`,
    time: "20:31",
    title: "Arrivée Québec YQB 🍁",
    notes: "Nicolas.",
  },
];

const checklist: string[] = [
  "① Concert Gonfalone — 2 déc. 20h30 — oratoriogonfalone.eu ou classictic.com · ~30–52 € · vérifier programme décembre",
  "② Vol Air Canada — confirmer le paiement · ~1200 $ CA · tarif Basic",
  "③ Train Ivana aller — trenitalia.com ou italo.it · 29 nov. matin · Santhia → Termini · ~50–70 €",
  "④ Train Ivana retour — trenitalia.com ou italo.it · 5 déc. · Termini → Santhia · ~50–70 €",
  "⑤ Hôtel — 2 chambres — Condominio Monti Boutique Hotel · condominiomonti.com · 29 nov.–5 déc.",
  "⑥ Colisée + Forum — colosseo.it · billet combiné",
  "⑦ Thermes de Caracalla — coopculture.it · ~8 €/pers · ouvert le lundi",
  "⑧ Palazzo Valentini — palazzovalentini.it",
  "⑨ Panthéon — direzionemuseiroma.cultura.gov.it",
  "⑩ Taxi Ivana 5 déc. — itTaxi · commander la veille au soir · 8h45",
  "⑪ La Carbonara — 3 dîners (dim 29, lun 30, mar 1) — Via della Madonna dei Monti 103 · réserver en même temps",
  "⑫ Armando al Pantheon — déjeuner mer 2 — Salita dei Crescenzi 31 · réserver plusieurs semaines à l'avance",
  "⑬ Da Enzo al 29 — dîner adieu jeu 3 — Via dei Vascellari 29 · Trastevere · réserver",
];

// Bagages — Météo & Vêtements (4–14 °C, ~11 °C en journée, quelques averses brèves)
const packingGeneral: string[] = [
  "T-shirt respirant (couche de base, musées surchauffés)",
  "Pull en laine ou polaire légère (couche intermédiaire)",
  "Manteau / doudoune compacte (extérieurs, marches nocturnes, 8–11 °C le soir)",
  "Coupe-vent imperméable + parapluie de poche (averses brèves mais franches)",
  "Chaussures de marche à semelle antidérapante (sanpietrini glissants mouillés — pas de talons)",
  "Veste légère supplémentaire pour San Clemente & Mithraeum (niveaux souterrains humides, ~14 °C)",
  "Tenue décontractée-soignée pour la soirée Gonfalone (pas de code vestimentaire imposé)",
  "Chapeau + gants légers (utiles matin/soir)",
];

const packingIvana: string[] = [
  "Semelles antidérapantes (sanpietrini et dalles de marbre glissants)",
  "Veste sans capuche volumineuse (facilite l'entrée/sortie des musées)",
  "Écharpe chaude",
  "Couche chaude supplémentaire pour San Clemente (niveau inférieur froid et humide)",
  "Collation sucrée dans le sac chaque jour (glycémie)",
];

async function main() {
  const existing = await prisma.trip.findFirst({ where: { name: TRIP_NAME } });
  if (existing) {
    console.log(`Le voyage "${TRIP_NAME}" existe déjà (id: ${existing.id}). Rien à faire.`);
    console.log(`URL : /trip/${existing.id}`);
    return;
  }

  let inviteCode = generateInviteCode();
  for (let i = 0; i < 5; i++) {
    if (!(await prisma.trip.findUnique({ where: { inviteCode } }))) break;
    inviteCode = generateInviteCode();
  }

  const trip = await prisma.trip.create({
    data: {
      name: TRIP_NAME,
      destination: "Rome, Italie",
      startDate: new Date(`${YEAR}-11-28`),
      endDate: new Date(`${YEAR}-12-05`),
      currency: "EUR",
      // Estimation combinée (Rome + vols/train), convertie en EUR (~0.65 EUR/CAD) :
      // Nicolas ~1374€ (Rome) + 1014€ (vol A/R ~1200 $CA + bagages ~360 $CA = 1560 $CA, convertis)
      // + Ivana ~1341€ (Rome + train) = 3729€
      budget: 3729,
      inviteCode,
      members: {
        create: [
          { name: "Nicolas", color: colorForIndex(0) },
          { name: "Ivana", color: colorForIndex(1) },
        ],
      },
    },
    include: { members: true },
  });

  console.log(`Voyage créé : ${trip.name} (id: ${trip.id}, code: ${trip.inviteCode})`);

  await prisma.itineraryItem.createMany({
    data: itinerary.map((item, index) => ({
      tripId: trip.id,
      date: new Date(item.date),
      time: item.time,
      title: item.title,
      location: item.location ?? null,
      notes: item.notes ?? null,
      order: index,
    })),
  });
  console.log(`${itinerary.length} étapes d'itinéraire ajoutées.`);

  await prisma.checklistItem.createMany({
    data: checklist.map((title, index) => ({
      tripId: trip.id,
      title,
      category: "todo",
      order: index,
    })),
  });
  console.log(`${checklist.length} tâches de réservation ajoutées.`);

  const ivana = trip.members.find((m) => m.name === "Ivana");
  await prisma.checklistItem.createMany({
    data: [
      ...packingGeneral.map((title, index) => ({
        tripId: trip.id,
        title,
        category: "packing",
        order: index,
      })),
      ...packingIvana.map((title, index) => ({
        tripId: trip.id,
        title,
        category: "packing",
        assignedToId: ivana?.id ?? null,
        order: packingGeneral.length + index,
      })),
    ],
  });
  console.log(`${packingGeneral.length + packingIvana.length} tâches de bagages ajoutées.`);

  console.log("\nTerminé.");
  console.log(`Lien à partager avec Ivana : /trip/${trip.id}/join`);
  console.log(`Code d'invitation : ${trip.inviteCode}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
