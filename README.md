# Yuma Project

## Deploy using docker

- Copy `backend/charibin/docker_settings.py.example` to `backend/charibin/docker_settings.py` and fill necessary variables
- Copy `frontend/.env.example` to `frontend/.env` and fill necessary values.
- Put SSH key file to `docker/ssh/staging` or `docker/ssh/production`.
- Use `fab staging bootstrap` or `fab production bootstrap` to set up server environment. Needed only for the first deploy.
- Use `fab staging deploy` or `fab production deploy` to build and run containers.
