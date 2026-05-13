#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -f "$repo_root/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$repo_root/.env"
  set +a
fi

export TODO_API_URL="${TODO_API_URL:-http://127.0.0.1:5040}"
export TODO_WEB_URL="${TODO_WEB_URL:-http://127.0.0.1:4200}"
export ASPNETCORE_ENVIRONMENT="${ASPNETCORE_ENVIRONMENT:-Development}"
export DOTNET_WATCH_SUPPRESS_LAUNCH_BROWSER="${DOTNET_WATCH_SUPPRESS_LAUNCH_BROWSER:-1}"
export CHROME_BIN="${CHROME_BIN:-/usr/bin/chromium-browser}"

TODO_API_HOST="${TODO_API_URL%:*}"
TODO_API_HOST="${TODO_API_HOST#http://}"
TODO_API_PORT="${TODO_API_URL##*:}"
TODO_WEB_HOST="${TODO_WEB_URL%:*}"
TODO_WEB_HOST="${TODO_WEB_HOST#http://}"
TODO_WEB_PORT="${TODO_WEB_URL##*:}"

export TODO_API_HOST
export TODO_API_PORT
export TODO_WEB_HOST
export TODO_WEB_PORT
export ASPNETCORE_URLS="$TODO_API_URL"
