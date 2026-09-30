# v0-e-commerce-website-build

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_ua1o5BjOikNQZ8D3X9fJVkJzKGGC)

## Getting Started

Install dependencies and run the development server:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The storefront home page is in `app/(storefront)/page.tsx`.

## Deploying to Vercel

Import this repository as a **Next.js** project with the repository root (`./`) as the Root Directory. Use Node.js **22.x** and leave the Output Directory unset (Next.js is detected automatically). The repository uses pnpm 10 and `pnpm-lock.yaml`. Vercel should auto-detect the build settings; if you have custom overrides, set the Install Command to `pnpm install --frozen-lockfile` and the Build Command to `pnpm build`. Locally, run `corepack enable` before running pnpm.

No environment variables are needed for the current demo storefront. Cart, wishlist, and orders use browser storage, not a server-side database. Merge changes to `main` to trigger the production deployment linked to this repository. If a Vercel build still fails, check that the Vercel project's Root Directory, Framework Preset, and Node.js version match the settings above and inspect its build logs.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/BFH-HAMID/v0-e-commerce-website-build" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
