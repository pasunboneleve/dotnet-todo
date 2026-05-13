# TODO App

[![CI](https://github.com/pasunboneleve/dotnet-todo/actions/workflows/ci.yml/badge.svg)](https://github.com/pasunboneleve/dotnet-todo/actions/workflows/ci.yml)

A small TODO list application built with [Angular](https://angular.dev/) 21 and [ASP.NET Core](https://dotnet.microsoft.com/en-us/apps/aspnet) on [.NET](https://dotnet.microsoft.com/en-us/download) 10. The frontend calls a backend Web API, and the backend stores TODO items in memory for the lifetime of the API process.

## Architecture at a glance

- `TodoFrontend/` contains the Angular client.
- `TodoApi/` contains the ASP.NET Core Minimal API.
- `TodoApi.Tests/` contains backend integration tests.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) explains the runtime boundaries and data flow.
- [docs/TESTING.md](docs/TESTING.md) explains the test layers and validation commands.

## Prerequisites

Required:

- [.NET SDK](https://dotnet.microsoft.com/en-us/download) 10.
- [Node.js](https://nodejs.org/) `^22.12.0` or `^24.0.0`.
- [npm](https://docs.npmjs.com/) for frontend dependency and script commands.
- [GNU Bash](https://www.gnu.org/software/bash/) or a Bash-compatible shell for the repository scripts in `scripts/`.
- A [dotenv](https://www.dotenv.org/docs/security/env.html)-style `.env` file format. The repository scripts parse simple `KEY=value` lines themselves; no external dotenv binary is required.
- [Chromium](https://www.chromium.org/chromium-projects/) or Chrome for Angular unit tests run through Karma.
- [Docker Engine](https://docs.docker.com/engine/) or Docker Desktop for the local [Playwright](https://playwright.dev/) smoke test. This project uses `docker run`, not Docker Compose.

Optional:

- [direnv](https://direnv.net/) for automatically exporting `.env` into your interactive shell through the committed [.envrc](.envrc).
- [devloop](https://github.com/pasunboneleve/devloop) for supervising the backend, frontend, and frontend test watcher in one terminal.

## Quick start

Start the backend:

```sh
./scripts/api.sh
```

In a second terminal, install frontend dependencies and start Angular:

```sh
cd TodoFrontend
npm install
../scripts/web.sh
```

Open:

```text
http://localhost:4200
```

Angular serves the frontend and proxies `/api/*` requests to the backend at `http://127.0.0.1:5040`.

Local defaults live in [.env.example](.env.example). The scripts work without `.env`, because they apply the same defaults internally. To override ports or tool paths, copy `.env.example` to `.env`; those values are loaded automatically only by the repository scripts. If you use direnv, run `direnv allow` once and [.envrc](.envrc) will export `.env` into your shell.

## Validation

Backend:

```sh
dotnet test Todo.slnx
```

Frontend:

```sh
cd TodoFrontend
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```

On Linux, if Karma cannot find Chrome or Chromium, set `CHROME_BIN`:

```sh
CHROME_BIN=/usr/bin/chromium-browser npm test -- --watch=false --browsers=ChromeHeadless
```

Full-stack smoke test with Docker, after the backend and frontend are running:

```sh
npm --workspace TodoFrontend run e2e:docker
```

To write the HTML report into `TodoFrontend/.playwright-report/` and open it in your browser:

```sh
npm --workspace TodoFrontend run e2e:docker:open
```

## Optional contributor workflow

This repository includes [devloop.toml](devloop.toml) for contributors who have the local devloop tool installed:

```sh
./scripts/devloop.sh run
```

`devloop` is not required to run or review the project.

## License

This project is licensed under the MIT License. The optional `devloop` workflow is included to show one way to supervise the backend, frontend, and test watcher during development.

## Current constraints

- TODO data is stored in backend memory only.
- Restarting the backend clears the list.
- There is no authentication, database, deployment packaging, or edit-complete workflow.
