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

echo "Creating superuser if DJANGO_SUPERUSER_* env vars are present..."
if [ -n "${DJANGO_SUPERUSER_USERNAME:-}" ] && [ -n "${DJANGO_SUPERUSER_PASSWORD:-}" ]; then
	# create_admin management command is idempotent and will skip if user exists
	python manage.py create_admin || echo "create_admin failed (check logs)"
else
	echo "No DJANGO_SUPERUSER_* env vars found — skipping superuser creation"
fi

echo "Build script finished."
