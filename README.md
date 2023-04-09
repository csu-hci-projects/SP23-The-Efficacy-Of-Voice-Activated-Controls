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

**_working with DB to retain volume_**

# To run frontend locally on dev

cd into frontend

run "npm install" on cli/gitbash

run "ng serve" on cli/gitbash

**_Task List for the application_**

- User Sign in - frontend form - Justin DONE ✓
- user sign in - middleware api call - Camden
- user sign in - backend table - Kimeron
- education step page - frontend - Justin DONE ✓
- game implementation 1 mouse - frontend - Justin DONE ✓
- voice command implementation - frontend - Justin In progress - 
- game implementation 2 VC - frontend - Justin in progress - 
- session metrics - frontend
- session metrics - middleware
- session metrics - backend
- feedback form - fromtend
- feedback form - middleware
- feedback form - backend
- Data analytics - middleware
- data analytics - backend
