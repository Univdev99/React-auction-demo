# Charibin project

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Deploy to server

- Go to /var/www/ and run `git clone git@...` to clone into `charibin-tmp` folder.
- Change permission of /var/www/ folder to current user
- Change dir into `charibin-tmp`
- If you're deploying for the first time:
 1. Run `./deploy/postgresql.sh` to install PostgreSQL.
 2. Setup database and user.
 3. Copy `backend/charibin/local_settings.py.example` to `backend/charibin/local_settings.py` and fill necessary values.
 4. Run `./deploy/bootstrap.sh`.
- When deploying next time:
 1. run `./deploy/deploy.sh`.
