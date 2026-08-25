# Voyage Ivana

Application web pour organiser un voyage à plusieurs : itinéraire jour par jour, budget partagé (avec calcul automatique des remboursements), checklist et documents de voyage.

## Fonctionnement

- **Créer un voyage** génère un code d'invitation à 6 caractères.
- **Rejoindre un voyage** se fait avec ce code (ou directement via le lien partagé) + un prénom — pas de mot de passe.
- Chaque participant est reconnu via un cookie de session sur son appareil.

## Stack technique

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS v4
- [Prisma](https://www.prisma.io) + PostgreSQL

## Démarrer en local

Nécessite une base PostgreSQL accessible (locale ou hébergée). Copier `.env.example` en `.env` et y renseigner `DATABASE_URL`, puis :

```bash
npm install
npx prisma migrate deploy   # crée les tables à partir des migrations
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

### Charger le voyage à Rome (Nicolas & Ivana)

Un script recrée automatiquement ce voyage précis (itinéraire complet du 28 nov. au 5 déc., budget cible, checklist des réservations) :

```bash
npm run seed:rome
```

Il affiche ensuite le code d'invitation et le lien à partager. Le script ne fait rien s'il existe déjà un voyage portant ce nom (pas de doublons).

## Commandes utiles

- `npm run dev` — serveur de développement
- `npm run build` / `npm start` — build et exécution en production
- `npm run lint` — ESLint
- `npx prisma studio` — explorer la base de données
- `npx prisma migrate dev --name <nom>` — créer une nouvelle migration après avoir modifié `prisma/schema.prisma`

## Déploiement (Vercel)

1. Pousser le dépôt sur GitHub (déjà fait pour `nicdupre/Voyage-Ivana`).
2. Sur [vercel.com](https://vercel.com), se connecter avec GitHub et importer le dépôt.
3. Dans l'onglet **Storage** du projet Vercel, créer une base **Postgres** (Neon) et la connecter au projet — Vercel ajoute automatiquement `DATABASE_URL` dans les variables d'environnement.
4. Déployer. Une fois le premier déploiement terminé, exécuter les migrations sur la base de production :
   ```bash
   DATABASE_URL="<url copiée depuis Vercel Storage>" npx prisma migrate deploy
   DATABASE_URL="<url copiée depuis Vercel Storage>" npm run seed:rome   # optionnel : charge le voyage à Rome
   ```
5. Ouvrir l'URL `*.vercel.app` sur chaque appareil, puis **Partager → Sur l'écran d'accueil** (Safari, iPhone/iPad) pour l'installer comme une app.
