![Logo](https://onecharge.co.th/img/2025/logo-onecharge.svg)
&nbsp;

&nbsp;

# OneCharge Partner (Backoffice)

Front-End dashboard for OneCharge partners to manage teams/groups, stations, chargers, transactions, revenue/taxes, and members.

## Tech Stack

**Framework:** `Next.js 15 (App Router)` , `React 19` , `TypeScript`

**UI/UX & Styling:** `ShadCN ` + `Tailwind 4` , `lucide-react` , `sonner`

**Maps/Charts:** `react-leaflet` , `recharts`

**Forms/Validation:** `react-hook-form`,`zod`,`@hookform/resolvers`

**State:** `@tanstack/react-query`,`Zustand`

**Tooling:** `ESLint`, `Prettier`, `Storybook` (Vite), `Vitest`

**Runtime Environment:** `Node.js ≥ 18.x`

## Run Locally

Clone the project

```bash
  git clone https://gitlab.com/developer1061/backoffice-fe-onecharge-web-partner.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm dev
```

The app will run at `http://localhost:3000`

## Environment Variables

Configure in `.env.local`

- `NEXT_PUBLIC_API_BASE_URL`: Main API base URL (e.g., `https://onecharge-newadmin-api.gramick.dev`)
- `NEXT_PUBLIC_OCPP_BASE_URL` (optional): OCPP WebSocket base URL (default `ws://ocpp.onecharge.co.th`)

Note: There's a `rewrites` configuration in `next.config.mjs` for proxying `"/api/:path*"` to `https://onecharge-newadmin-api.gramick.dev/:path*`

## Common Scripts

- `pnpm dev`: Run development mode (Next.js + Turbopack)
- `pnpm build`: Build production bundle
- `pnpm start`: Run production server (must run `pnpm build` first)
- `pnpm lint`: Check and fix code with ESLint
- `pnpm format`: Format code with Prettier
- `pnpm check-all`: Run comprehensive lint/format/build check
- `pnpm storybook`: Run Storybook on port 6006
- `pnpm build-storybook`: Build static Storybook

## Deployment

To deploy this project run

```bash
  pnpm lint:check
  pnpm lint
  pnpm format:check
  pnpm format
  pnpm build

```

or

```md
pnpm check-all
pnpm pre-commit
```

> **Note:** Run the following commands **to ensure the pipeline build passes** before deploying.

## Authors

- [@DevW4Kim](https://www.github.com/octokatherine)
