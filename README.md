# Turbo Monorepo

This is a monorepo built with [Turborepo](https://turbo.build/repo) that includes:

- `apps/frontend`: A ReactJS + TypeScript web application.
- `apps/backend`: A Django API server.

## 🧱 Structure

```
personal-accountant/
├── apps/
│   ├── frontend/       # ReactJS Vite app
│   └── backend/        # Django API
├── turbo.json
├── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (`nvm use` after installing nvm)
- [Python 3.x](https://www.python.org/downloads/macos/)
- `pnpm` (`npm install -g pnpm`)

### Install dependencies

```bash
pnpm install
```

```bash
cd apps/backend
python3 -m venv venv
source venv/bin/activate
pip install -r ./requirements.txt
deactivate
```

### Create an environment variable files

Go to `/apps/frontend` folder and create a file called `.env.development` with the following content:

```bash
API_URL=
```

Go to `/apps/backend` folder and create a file called `.env` with the following content:

```bash
OPENAI_API_KEY=
ENVIRONMENT=develop
```

_Note: you can grab the corresponding values from [here](https://dashboard.plaid.com/developers/keys)._

### Start development

```bash
pnpm run dev
```

### AI APIs integration TBD

---

## 📦 Workspaces

- **Web app**: [apps/web](./apps/web)
- **API server**: [apps/backend](./apps/backend)
