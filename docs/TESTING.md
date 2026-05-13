# Testing

This project tests the backend HTTP contract and the frontend browser-facing behavior separately. The tests avoid a live database because TODO data is intentionally stored in backend memory.

## Test Layers

### Backend

`TodoApi.Tests` uses ASP.NET Core `WebApplicationFactory<Program>` tests. These tests exercise the real HTTP endpoints in process:

- `GET /api/todos` returns the current list.
- `POST /api/todos` trims and creates a TODO.
- Empty and oversized titles are rejected.
- `DELETE /api/todos/{id}` removes existing items.
- Deleting an unknown item returns `404 Not Found`.

### Frontend

Angular tests cover two boundaries:

- `TodoApiService` tests use `HttpTestingController` to verify relative `/api/todos` requests without a live backend.
- `AppComponent` tests mock `TodoApiService` and verify browser-facing behavior: loading, rendering, adding, deleting, errors, focus after add, title length, and newest-first ordering.

### Full Stack Smoke Test

The Playwright smoke test starts the real .NET API and the real Angular dev server, then drives the app through a browser. It verifies one user path: load the empty list, add a TODO, see it rendered, delete it, and return to the empty state.

## Running Tests

Backend:

```sh
dotnet test Todo.slnx
```

Frontend:

```sh
cd TodoFrontend
npm test -- --watch=false --browsers=ChromeHeadless
```

On Linux, if Karma cannot find Chrome or Chromium, set `CHROME_BIN`:

```sh
CHROME_BIN=/usr/bin/chromium-browser npm test -- --watch=false --browsers=ChromeHeadless
```

Frontend build check:

```sh
cd TodoFrontend
npm run build
```

Full stack smoke test in CI or an environment with Playwright browsers installed:

```sh
cd TodoFrontend
npx playwright install chromium
npm run e2e
```

Full stack smoke test with Docker, after the backend and frontend are running:

```sh
npm --workspace TodoFrontend run e2e:docker
```

To write the HTML report into `TodoFrontend/.playwright-report/` and open it in your browser:

```sh
npm --workspace TodoFrontend run e2e:docker:open
```

The Docker wrapper chooses host networking on Linux and `host.docker.internal` on Docker Desktop platforms.

## Continuous Integration

GitHub Actions runs the same validation on `ubuntu-latest` for pushes and pull requests:

- Backend job: `dotnet restore Todo.slnx`, then `dotnet test Todo.slnx --no-restore`.
- Frontend job: `npm ci`, `npx playwright install --with-deps chromium`, `npm run build`, `npm test -- --watch=false --browsers=ChromeHeadless`, then `npm run e2e`.

## Development Watch Mode

Backend:

```sh
dotnet watch --project TodoApi test
```

Frontend:

```sh
cd TodoFrontend
npm test
```

Optional local workflow:

```sh
devloop run
```

`devloop` is optional. It starts the API, Angular dev server, and frontend test watcher together for contributors who have it installed.

## What Is Not Covered

- No broad browser E2E suite beyond the single full-stack smoke path.
- No persistence tests, because there is no database.
- No authentication or authorization tests.
- No deployment or production-hosting tests.

## Test Design Notes

- Backend tests exercise HTTP behavior rather than store internals.
- Frontend service tests mock HTTP.
- Component tests mock the API service, not Angular internals.
- Ordering is tested at the component boundary because newest-first display is a frontend presentation rule.
