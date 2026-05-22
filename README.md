# A-List

![A-List](https://assets.mattwyskiel.com/a-list/podcast-image.jpeg)

A home website for my DJ-style mixes.

- Production: <https://a-list.mattwyskiel.com>
- Dev: <https://dev.a-list.mattwyskiel.com>
- Podcast feed: <https://a-list.mattwyskiel.com/api/podcast-feed>

## Background

I grew up with a love for music. My parents raised me on James Taylor, John Mayer, Donald Fagen, and Van Halen. For many years, at least since college, I've been building my skills on the side as a DJ and mixer, most prominently putting them to use as host of my college radio show King Matt's A-List.

Post-college, I started creating mixes again, and I began hosting them on my asset server and sending links to my friends. As I did it more and more, I realized they would want an easier experience listening, and that I too would want an easier way to access my mixes when I want to listen to them.

See a need, fill a need!

## Features

- Public list of non-archived, non-draft mixes
- Individual mix pages with audio playback
- Podcast RSS feed for podcast apps
- DynamoDB-backed mix metadata storage
- Seed endpoint that imports mix metadata from the external asset bucket

## Stack

- **App:** Next.js App Router, React, TypeScript, Tailwind CSS
- **Runtime:** OpenNext on AWS Lambda
- **CDN:** Amazon CloudFront
- **Database:** Amazon DynamoDB
- **Assets:** External S3-backed asset host at `assets.mattwyskiel.com`
- **Infrastructure:** Pulumi
- **Package manager:** Bun

## Repository Layout

This repository is published from a larger private monorepo. The app-specific source is included here; some private workspace packages and deployment helpers are referenced by the source but are not published in this repository.

- `index.ts` - Pulumi program for the A-List site and DynamoDB table
- `src/` - Next.js application source
- `src/app/api/podcast-feed/route.ts` - podcast RSS route
- `src/app/api/seed-db/route.ts` - imports metadata from `com.mattwyskiel.assets/a-list/`
- `src/app/mixes/[slug]/page.tsx` - individual mix page
- `src/components/` - UI components for the mix list and player

## Local Development

This public repository is primarily a source mirror. Running the app exactly as deployed requires private workspace packages, AWS resources, and secrets from the private infrastructure repo.

If you have the full private workspace, run the app from this directory with:

```bash
bun run dev
```

The local dev script serves the app at <http://a-list.localhost:3003> and defaults to:

- `TABLE_NAME=a-list-entries-dev`
- `A_LIST_URL=http://a-list.localhost:3003`
- `NEXT_PUBLIC_STACK=dev`

## Build and Typecheck

Within the full private workspace:

```bash
bun run typecheck
bun run --cwd src build
```

The production build uses OpenNext and produces `.open-next/` artifacts consumed by Pulumi deploys.

## Deploy

Deployments are managed from the private infrastructure workspace with Pulumi and CI/CD. This public mirror does not include all deployment dependencies or secrets required to deploy the site.

## Data Model

Mix metadata lives in DynamoDB and is keyed by numeric `id`. A global secondary index named `bySlug` supports lookups for `/mixes/[slug]`.

The deployed Lambda receives:

- `A_LIST_URL` - canonical base URL for server-side route fetches
- `TABLE_NAME` - DynamoDB table name
- `NEXT_PUBLIC_STACK` - deployment stack name
