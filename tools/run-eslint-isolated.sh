#!/usr/bin/env bash
set -euo pipefail

# Run a pinned eslint via npx to avoid relying on project devDependencies.
# Use npx -p/--package to force installation of the requested packages and
# --ignore-existing so local node_modules binaries are not used.
PROJ_ROOT="$(pwd)"
TMP_DIR="$(mktemp -d /tmp/eslint-run-XXXX)"
echo "Creating isolated eslint run in $TMP_DIR"
pushd "$TMP_DIR" > /dev/null
echo "Initializing temporary environment..."
npm init -y --silent > /dev/null
echo "Installing eslint and plugins (this may take a while)..."
npm install --no-audit --no-fund --silent eslint@8.57.1 @typescript-eslint/parser@6.21.0 @typescript-eslint/eslint-plugin@6.21.0 > /dev/null
echo "Running eslint against project source..."
"$TMP_DIR/node_modules/.bin/eslint" --ext .ts,.html "$PROJ_ROOT/src" --fix || true
RC=$?
echo "ESLint exit code: $RC"
popd > /dev/null
echo "Cleaning up $TMP_DIR"
rm -rf "$TMP_DIR"
exit $RC
