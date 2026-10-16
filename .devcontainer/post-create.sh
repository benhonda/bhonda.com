#!/bin/bash
set -euo pipefail

# Everything else is baked into the base image. This stays here because it clones
# over SSH with the host's mounted keys, which aren't available at image build time.

# adskills
d=$(mktemp -d)
trap 'rm -rf "$d"' EXIT
git clone -q --depth 1 git@github.com:adpharm/adpharm-skills.git "$d"
bash "$d/scripts/install.sh"
