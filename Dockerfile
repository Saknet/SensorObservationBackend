#Specify a base image
FROM node:alpine

WORKDIR /usr/app

# Install some dependencies
COPY ./package.json ./
RUN npm install
COPY ./ ./

EXPOSE 3000
CMD [ "npm", "start", "pm2" ]


