# TODO App

[![CI](https://github.com/pasunboneleve/dotnet-todo/actions/workflows/ci.yml/badge.svg)](https://github.com/pasunboneleve/dotnet-todo/actions/workflows/ci.yml)

A small TODO list application built with Angular 21 and ASP.NET Core on .NET 10. The frontend calls a backend Web API, and the backend stores TODO items in memory for the lifetime of the API process.

## Architecture at a glance

- `TodoFrontend/` contains the Angular client.
- `TodoApi/` contains the ASP.NET Core Minimal API.
- `TodoApi.Tests/` contains backend integration tests.
- `docs/ARCHITECTURE.md` explains the runtime boundaries and data flow.
- `docs/TESTING.md` explains the test layers and validation commands.

## Prerequisites

- .NET 10 SDK
- Node.js `^22.12.0` or `^24.0.0`
- npm

## Quick start

Start the backend:

```sh
dotnet run --project TodoApi --launch-profile http
```

In a second terminal, install frontend dependencies and start Angular:

```sh
cd TodoFrontend
npm install
npm start
```

Open:

```text
http://localhost:4200
```

Angular serves the frontend and proxies `/api/*` requests to the backend at `http://localhost:5040`.

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

## Optional contributor workflow

This repository includes `devloop.toml` for contributors who have the local [`devloop`](https://github.com/pasunboneleve/devloop) tool installed:

```sh
devloop run
```

`devloop` is not required to run or review the project.

## License

This project is licensed under the MIT License. The optional `devloop` workflow is included to show one way to supervise the backend, frontend, and test watcher during development.

## Current constraints

- TODO data is stored in backend memory only.
- Restarting the backend clears the list.
- There is no authentication, database, deployment packaging, or edit-complete workflow.
