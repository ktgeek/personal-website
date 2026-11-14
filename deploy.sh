#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/deploy.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: deploy.env not found. Copy deploy.env.example to deploy.env and fill in your values." >&2
  exit 1
fi

# shellcheck source=deploy.env.example
source "$ENV_FILE"

if [[ -z "${DEPLOY_HOST:-}" || -z "${DEPLOY_PATH:-}" ]]; then
  echo "Error: DEPLOY_HOST and DEPLOY_PATH must be set in deploy.env" >&2
  exit 1
fi

# engines is only advisory for npm run, so check here, before clean deletes _site. Assumes engines.node is ">=VERSION".
min_node="$(node -p 'require(process.argv[1]).engines.node.replace(/^>=/, "")' "$SCRIPT_DIR/package.json")"
if [[ ! "$min_node" =~ ^[0-9]+(\.[0-9]+)*$ ]]; then
  echo "Error: can't parse engines.node from package.json (expected \">=VERSION\")" >&2
  exit 1
fi
found_node="$(node -p 'process.versions.node')"
if [[ "$(printf '%s\n%s\n' "$min_node" "$found_node" | sort -V | head -n1)" != "$min_node" ]]; then
  echo "Error: Node $min_node or newer required (found v$found_node)" >&2
  exit 1
fi

npm run clean
npm run build
rsync -acr --out-format='%n' --delete _site/ "$DEPLOY_HOST:$DEPLOY_PATH"
