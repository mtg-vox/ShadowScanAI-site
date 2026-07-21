#!/usr/bin/env bash
set -euo pipefail

RESOURCE_GROUP="${RESOURCE_GROUP:-shadowscan-rg}"
STATIC_APP="${STATIC_APP:-shadowscan-site}"
SITE_DIR="$(cd "$(dirname "$0")" && pwd)"

deployment_token="$(az staticwebapp secrets list \
  -n "$STATIC_APP" -g "$RESOURCE_GROUP" \
  --query properties.apiKey -o tsv)"

pushd /tmp >/dev/null
SWA_CLI_DEPLOYMENT_TOKEN="$deployment_token" \
  npx --yes @azure/static-web-apps-cli@latest deploy "$SITE_DIR" --env production
popd >/dev/null

echo "Deployed to: https://polite-ocean-0c0bd210f.7.azurestaticapps.net"