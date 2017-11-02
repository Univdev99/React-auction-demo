sudo -u www-data git pull
source venv/bin/activate
cd backend
pip install -r ./requirements.txt
./manage.py migrate
cd ..
deactivate
cd frontend
yarn
yarn run build
cd ..
sudo service gunicorn restart