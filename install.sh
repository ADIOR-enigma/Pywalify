#!/bin/sh

set -e

# Download URL
theme_url="https://raw.githubusercontent.com/ADIOR-enigma/Pywalify/main"

# Setup directories to download to
spice_dir="$(dirname "$(spicetify -c)")"
theme_dir="${spice_dir}/Themes"

# Make directories if needed
mkdir -p "${theme_dir}/wal"

# Download latest tagged files into correct director
echo "Downloading wal..."
curl --silent --output "${theme_dir}/wal/color.ini" "${theme_url}/color.ini"
echo "Done"

# Apply theme
echo "Applying theme"
spicetify config current_theme wal color_scheme wal
spicetify config inject_css 1 replace_colors 1 overwrite_assets 1 inject_theme_js 1
spicetify apply

echo "All done!"
