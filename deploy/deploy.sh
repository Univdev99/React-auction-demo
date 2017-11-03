# build
source venv/bin/activate
cd backend
pip install -r ./requirements.txt
./manage.py migrate
./manage.py collectstatic
cd ..
deactivate
cd frontend
yarn
yarn run build
cd ..

# permission
sudo chown www-data:ubuntu -r /var/www/charibin-tmp/frontend/build

# restart app
sudo systemctl restart gunicorn
