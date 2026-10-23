#!/bin/bash
set -euo pipefail

# Everything else is baked into the base image. This stays here because adpharm-skills is private: it clones with
# your gh login locally, and with the codespace's token (granted in devcontainer.json) in a codespace.

# adskills
d=$(mktemp -d)
trap 'rm -rf "$d"' EXIT
gh repo clone adpharm/adpharm-skills "$d" -- -q --depth 1
bash "$d/scripts/install.sh"
