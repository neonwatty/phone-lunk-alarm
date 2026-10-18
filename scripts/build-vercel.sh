#!/usr/bin/env bash
set -euo pipefail

# Vercel starts from Git, so ignored GPU assets must be generated before prebuild.
# Match the Python version and verified conversion used by GitHub CI/Pages.
model_env=$(mktemp -d "${TMPDIR:-/tmp}/phone-lunk-build.XXXXXX")
trap 'rm -rf "$model_env"' EXIT
python3.12 -m venv "$model_env"
"$model_env/bin/python" -m pip install --disable-pip-version-check -r scripts/model-requirements.txt
"$model_env/bin/python" scripts/prepare-gpu-model.py
npm run build
