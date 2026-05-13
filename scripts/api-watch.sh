#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$repo_root/scripts/env.sh"

exec dotnet watch --project "$repo_root/TodoApi" run --no-launch-profile
