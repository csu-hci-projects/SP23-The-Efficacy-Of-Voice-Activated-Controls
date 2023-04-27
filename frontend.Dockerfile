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