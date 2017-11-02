virtualenv -p python3 venv
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
sudo cp -f ./configs/gunicorn.service /etc/systemd/system/gunicorn.service
sudo service gunicorn start
sudo cp -f ./configs/charibin /etc/nginx/sites-available
sudo ln -s /etc/nginx/sites-available/charibin /etc/nginx/sites-enabled/charibin
sudo service nginx restart