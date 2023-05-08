# base image
FROM node:18-buster AS build
WORKDIR /voice_control_frontend
COPY ./frontend /voice_control_frontend

# install dependencies
COPY ./frontend/package.json /voice_control_frontend
RUN npm install
RUN npm install -g @angular/cli

# build
RUN ng build --output-path=dist

# get image
FROM nginx:latest

# copy from build env
COPY --from=build ./voice_control_frontend/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
# expose port
EXPOSE 80

# run it
CMD ["nginx", "-g", "daemon off;"]