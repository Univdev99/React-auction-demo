# build tools
sudo apt -y install build-essential

# nodejs
curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh | sudo bash -
sudo apt install nodejs

# nginx
sudo apt update && sudo apt -y install nginx
sudo chown www-data:www-data .

# yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt -y install yarn

# project venv, build
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
sudo cp -f ./deploy/configs/gunicorn.service /etc/systemd/system/gunicorn.service
sudo service gunicorn start
sudo cp -f ./deploy/configs/charibin /etc/nginx/sites-available
sudo ln -s /etc/nginx/sites-available/charibin /etc/nginx/sites-enabled/charibin
sudo service nginx restart
