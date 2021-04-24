#!/usr/bin/env bash

# Variables
remoteUserName="james"
remoteServer="gardiner.local"
remotePath="/share/configs/nginx/www/recipes/frontend"
localPath="./frontend/build/"
params=$1

# Build website

if [[ "$1" == "help" ]]; then
    echo "Use deploy.sh build to build the frontend.  Use deploy.sh container to build the docker container"
fi

if [[ "$1" == "build" ]]; then
    docker-compose up -d react
    echo "Entering react container:  Enter 'yarn build' and then 'exit."
    docker-compose exec react /bin/bash
fi

if [[ "$1" == "container" ]]; then
    docker login --username wrath625
    docker-compose build web
    docker push 'wrath625/recipes_web:latest'
    echo "Succcess.  You will need to docker-compose pull web on the remote server."
    exit 1
fi

if [[ "$1" == "nginx" ]]; then
    rsync -vrzc --delete ./nginx.conf ${remoteUserName}@${remoteServer}:/opt/app/
    exit 1
fi


# Tell user what will be deployed
echo "Deploying from: $localPath"
echo "Deploying to: $remotePath"

# Start rsync using ssh
rsync -vrzc --delete ${localPath} ${remoteUserName}@${remoteServer}:${remotePath}

if [[ "$1" == "build" ]]; then
    rsync -vrzc --delete ./app/static/admin/ ${remoteUserName}@${remoteServer}:${remotePath}/static/admin
fi
exit 0