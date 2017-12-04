# Yuma Project

## Deploy using docker

- Copy `backend/charibin/docker_settings.py.example` to `backend/charibin/docker_settings.py` and fill necessary variables
  These variables should be filled: `CORS_ORIGIN_WHITELIST`, `AMAZON_S3_REGION`, `AMAZON_S3_BUCKET`, `AMAZON_S3_ACCESS_KEY_ID`, `AMAZON_S3_ACCESS_SECRET`, `PINAX_STRIPE_PUBLIC_KEY`, `PINAX_STRIPE_SECRET_KEY`
- Copy `frontend/.env.example` to `frontend/.env` and fill necessary values.
  This variable should be filled: `REACT_APP_STRIPE_PUBLIC_KEY`
- Put SSH key file to `docker/ssh/staging` or `docker/ssh/production`.
- Copy `fabric_settings.py.example` to `fabric_settings.py`, and fill the necessary variables.
- Use `fab staging bootstrap` or `fab production bootstrap` to set up server environment. Needed only for the first deploy.
- Use `fab staging deploy` or `fab production deploy` to build and run containers.
