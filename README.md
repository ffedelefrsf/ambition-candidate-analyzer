# Ambition Candidate Analyzer

This is a monorepo built with [Turborepo](https://turbo.build/repo) that includes:

- `apps/frontend`: A ReactJS + TypeScript web application.
- `apps/backend`: A Django API server.

## 🧱 Structure

```
ambition-candidate-analyzer/
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
- `postgresql` (`brew install postgresql`) or [Docker](https://docs.docker.com/desktop/setup/install/mac-install/)
- `pnpm` (`npm install -g pnpm`)

### Create an environment variable files

In root folder `/`, create a file called `.env` containing:

```bash
DEBUG=1
POSTGRES_DB=ambition_candidate_analyzer
POSTGRES_USER=root
POSTGRES_PASSWORD=root
```

Go to `/apps/frontend` folder and create a file called `.env.development` with the following content:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

Go to `/apps/backend` folder and create a file called `.env` with the following content:

```bash
OPENAI_API_KEY=
```

### Install dependencies

#### Option 1: Docker

```bash
docker-compose build
```

#### Option 2: Local

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

### Start development

#### Option 1: Docker

```bash
docker-compose up
```

#### Option 2: Local

```bash
pnpm run dev
```

## 📦 Workspaces

<!-- TODO: Add README for these, including diagrams and more guides -->

- **Web app**: [apps/frontend](./apps/frontend)
- **API server**: [apps/backend](./apps/backend)
