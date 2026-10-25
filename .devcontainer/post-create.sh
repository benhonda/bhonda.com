#!/bin/bash
set -euo pipefail

# This repo's own setup, run once when its container is made. devbox already installs the repo's packages and
# Adpharm's Claude skills (claude-dispatch's devbox-setup), so nothing more is needed unless this repo needs it.
