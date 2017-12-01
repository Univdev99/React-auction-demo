#!/bin/bash
# start-frontend-dev.sh

cd /code/frontend

npm install
npm rebuild node-sass
npm run start
