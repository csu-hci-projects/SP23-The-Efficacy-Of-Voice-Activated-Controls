# SP23-The-Efficacy-Of-Voice-Activated-Controls

Authors: Justin Going, Camden McGinis, Kimeron Lazare, Andrew Jelkin

The purpose of this repo is to create a MVC for cs464 capstone on the efficacy of voice control in a game

# Pre-requisites

Git

Gitbash (if windows)

Node

Docker

Web Browser

# Instructions

Pull from repository

cd into directory

run "docker-compose up -d" in CLI/gitbash

use docker desktop to view containers or navigate browser to:

- Frontend dev: localhost:4200
- Frontend prod: localhost:8080 (swap ports and dockerfile commented out in docker-compose.yml)
- Fastap: localhost:5000/docs
- postgres:
  $ docker container ls
  $ docker exec -it <your-postgres-container-id> bash
  $ psql -d postgres -U postgres

DB will retain volume

# To run frontend locally on dev

cd into frontend

run "npm install" on cli/gitbash

run "ng serve" on cli/gitbash
