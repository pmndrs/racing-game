FROM node:lts
LABEL version="1.0"

RUN mkdir /racing-game
WORKDIR /racing-game
COPY . .

RUN yarn && yarn cache clean
CMD [ "yarn", "dev" ]