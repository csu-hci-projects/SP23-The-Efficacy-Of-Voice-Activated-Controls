# base image
FROM node:18-buster
WORKDIR /voice_control_frontend
COPY ./voice_control_frontend /voice_control_frontend

# install dependencies
COPY ./voice_control_frontend/package.json /voice_control_frontend
RUN npm install
RUN npm install -g @angular/cli

# build
RUN ng build -output-path=dist

# get image
FROM nginx:latest

# copy from build env
COPY --from=build ./voice_control_frontend/dist /usr/share/nginx/html

# expose port
EXPOSE 80

# run it
CMD ["nginx", "-g", "daemon off;"]