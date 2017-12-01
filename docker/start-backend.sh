#!/bin/bash
# start-backend.sh

cd /app/backend
cp ./charibin/docker_settings.py ./charibin/local_settings.py

# migration
python manage.py migrate

# static assets
python manage.py collectstatic --noinput

# now boot
gunicorn charibin.wsgi:application -b 0.0.0.0:8000 -t 300 --access-logfile /app/log/access.log --error-logfile /app/log/error.log
