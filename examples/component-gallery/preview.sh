#!/bin/bash
# Rebuilds the gallery from the current references/ kit so design changes can be previewed.
# Run from this directory: bash preview.sh
set -e
cp ../../references/styles.css ../../references/main.js ../../references/_footer.html ../../references/build.sh ../../references/build.ps1 .
bash build.sh
