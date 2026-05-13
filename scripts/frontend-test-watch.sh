#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$repo_root/scripts/env.sh"

exec npm --prefix "$repo_root/TodoFrontend" test -- --watch=true --browsers=ChromeHeadless
