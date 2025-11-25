#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit
set -o nounset
set -o pipefail

echo "Installing Python package dependencies..."
pip install --upgrade pip
pip install --no-cache-dir -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --noinput || echo "collectstatic returned non-zero status"

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Build script finished."
