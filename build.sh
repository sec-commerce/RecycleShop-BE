#!/bin/bash

cd /home/kvisnia/vendure
git pull
cd ./packages/common
yarn build
cd ../core
yarn build
/usr/bin/pm2 restart 0
