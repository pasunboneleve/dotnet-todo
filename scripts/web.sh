#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$repo_root/scripts/env.sh"

exec npm --prefix "$repo_root/TodoFrontend" start -- --host "$TODO_WEB_HOST" --port "$TODO_WEB_PORT"
