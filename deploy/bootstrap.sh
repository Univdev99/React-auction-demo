# build tools
sudo apt -y install build-essential

# python tools
sudo apt -y install python3-pip
sudo pip3 install virtualenv

# nodejs
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt -y install nodejs

# yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt -y install yarn

# postgresql
sudo apt -y update
sudo apt -y install postgresql postgresql-contrib

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

# gunicorn
sudo cp -f ./deploy/configs/gunicorn.service /etc/systemd/system/gunicorn.service
sudo systemctl daemon-reload
sudo systemctl restart gunicorn

# nginx
sudo apt update && sudo apt -y install nginx
sudo cp -f ./deploy/configs/charibin /etc/nginx/sites-available
sudo ln -s /etc/nginx/sites-available/charibin /etc/nginx/sites-enabled/charibin
touch /var/www/charibin-tmp/charibin.sock
sudo chown www-data:ubuntu /var/www/charibin-tmp/charibin.sock
sudo chown www-data:ubuntu /var/www/charibin-tmp/frontend/public
sudo service nginx restart
