FROM node:16.16.0

RUN mkdir -p /webservice
WORKDIR /webservice
COPY . .
RUN npm i
CMD npm start

EXPOSE 8000
