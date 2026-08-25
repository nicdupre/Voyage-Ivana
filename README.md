# Voyage Ivana

Application web pour organiser un voyage à plusieurs : itinéraire jour par jour, budget partagé (avec calcul automatique des remboursements), checklist et documents de voyage.

## Fonctionnement

- **Créer un voyage** génère un code d'invitation à 6 caractères.
- **Rejoindre un voyage** se fait avec ce code (ou directement via le lien partagé) + un prénom — pas de mot de passe.
- Chaque participant est reconnu via un cookie de session sur son appareil.

## Stack technique

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS v4
- [Prisma](https://www.prisma.io) + SQLite (base de données locale, fichier `dev.db`)

## Démarrer en local

```bash
npm install
npx prisma migrate deploy   # crée dev.db à partir des migrations
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

## Déploiement

SQLite convient pour un usage local ou un petit groupe sur un serveur avec disque persistant. Pour un déploiement sur une plateforme sans disque persistant (ex. Vercel), il faudra remplacer `DATABASE_URL` par une base hébergée (Postgres, Turso/LibSQL, etc.) — voir `prisma/schema.prisma` et `src/lib/prisma.ts`.
