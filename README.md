# Charity Auction Demo

## Deploy using docker

### Initial bootstrapping

- Put SSH key file to `docker/ssh/staging` or `docker/ssh/production`. (Depends on if you want to use this server as staging or production)
- Copy `fabric_settings.py.example` to `fabric_settings.py`, and fill the necessary variables.
  These variables should be filled:
    * PROJECT_GIT_REPO
    * []_SERVER
    * []_SERVER_SSH_KEY_FILE
    * []_SERVER_SSH_USER
    * []_SERVER_SSH_PASSWORD
  ([] can be STAGING or PRODUCTION)
- In terminal, run `fab staging bootstrap` or `fab production bootstrap` to set up server environment.
  * Important: this command will output public key of SSH key pair generated on this server. You must add this public key to the git repo account.
- In terminal, run `fab staging git_pull` or `fab production git_pull` to pull code from git into the server.
- Connect via SSH to the server, and go to PROJECT_ROOT.
- Copy `backend/charibin/docker_settings.py.example` to `backend/charibin/docker_settings.py` and fill necessary variables
- Copy `frontend/.env.example` to `frontend/.env` and fill necessary values.
- Disconnect from SSH.
- In terminal, run `fab staging deploy` or `fab production deploy` to build and run containers.

### Updating server

- Push code changes to git.
- In terminal, run `fab staging deploy` or `fab production deploy` to deploy latest version to the server. Before doing this, all steps in Deploy Using docker should be completed.

## Some additional operations available

- Create a super admin
  * Run `fab staging createsuperuser` or `fab production createsuperuser` to start create super user process.
  * Enter necessary information to finish the process and create super user.
  * You can login to Django admin (your-site-name.com/django-admin) and Yuma admin dashboard (your-site-name.com/admin) using this super user.

- Migrate database to the latest
  * Run `fab staging migrate` or `fab production migrate`.

- Update server without new commits on git
  * In terminal, run `fab staging rebuild` or `fab production rebuild`.
