# Testing

This project tests the backend HTTP contract and the frontend browser-facing behavior separately. The tests avoid a live database because TODO data is intentionally stored in backend memory.

## Test Layers

### Backend

`TodoApi.Tests` uses ASP.NET Core `WebApplicationFactory<Program>` tests. These tests exercise the real HTTP endpoints in process:

- `GET /api/todos` returns the current list.
- `POST /api/todos` trims and creates a TODO.
- Empty titles are rejected.
- `DELETE /api/todos/{id}` removes existing items.
- Deleting an unknown item returns `404 Not Found`.

### Frontend

Angular tests cover two boundaries:

- `TodoApiService` tests use `HttpTestingController` to verify relative `/api/todos` requests without a live backend.
- `AppComponent` tests mock `TodoApiService` and verify browser-facing behavior: loading, rendering, adding, deleting, errors, focus after add, and newest-first ordering.

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

- No browser E2E suite yet.
- No persistence tests, because there is no database.
- No authentication or authorization tests.
- No deployment or production-hosting tests.

## Test Design Notes

- Backend tests exercise HTTP behavior rather than store internals.
- Frontend service tests mock HTTP.
- Component tests mock the API service, not Angular internals.
- Ordering is tested at the component boundary because newest-first display is a frontend presentation rule.
