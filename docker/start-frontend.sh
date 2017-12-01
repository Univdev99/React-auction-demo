#!/bin/bash
# start-frontend.sh

cd /code/frontend

npm install
npm rebuild node-sass
npm run build
