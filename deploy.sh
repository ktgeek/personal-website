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

npm run clean
npm run build
rsync -acr --out-format='%n' --delete _site/ "$DEPLOY_HOST:$DEPLOY_PATH"
