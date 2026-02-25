#!/usr/bin/env bash
set -euo pipefail

# Run a pinned eslint via npx to avoid relying on project devDependencies.
# Use npx -p/--package to force installation of the requested packages and
# --ignore-existing so local node_modules binaries are not used.
npx --yes --package eslint@8.57.1 --package @typescript-eslint/parser@6.21.0 --package @typescript-eslint/eslint-plugin@6.21.0 --ignore-existing eslint --ext .ts,.html src --fix
