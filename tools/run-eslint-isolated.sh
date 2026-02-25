#!/usr/bin/env bash
set -euo pipefail

# Run a pinned eslint via npx to avoid relying on project devDependencies
npx -y eslint@8.57.1 @typescript-eslint/parser@6.21.0 @typescript-eslint/eslint-plugin@6.21.0 --ext .ts,.html src --fix
