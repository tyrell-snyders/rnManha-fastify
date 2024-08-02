FROM node:20-alpine

ADD package.json /tmp/package.json
ADD yarn.lock /tmp/yarn.lock

RUN cd /tmp && yarn --pure-lockfile

ADD ./ /src

RUN cp -a /tmp/node_modules /src/

WORKDIR /src

RUN npx prisma generate

RUN npm run-script build

## TODO rm  before deployment
EXPOSE 4000

CMD ["node", "build/src/app.js"]