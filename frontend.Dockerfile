#Stage 1
FROM node:18-buster
# setup workdir
WORKDIR /frontend
# add code
COPY ./frontend /frontend/
# install dependencies
COPY ./frontend/package.json /frontend/
RUN npm install
RUN npm install -g @angular/cli
# run it local
CMD ng serve --host 0.0.0.0

#Stage 2
FROM postgres:11.5-alpine
# run database instance
COPY init.sql /docker-entrypoint-initdb.d/
