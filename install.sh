#!/bin/sh

set -e

# Get Spicetify base directory
spice_dir="$(dirname "$(spicetify -c)")"
theme_dir="${spice_dir}/Themes"

# Create wal theme directory
mkdir -p "${theme_dir}/wal"

# Apply theme
echo "Applying wal theme..."
spicetify config current_theme wal color_scheme wal
spicetify config inject_css 1 replace_colors 1 overwrite_assets 1 inject_theme_js 1
spicetify apply

echo "Wal theme created"
