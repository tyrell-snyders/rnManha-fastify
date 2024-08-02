FROM node:16-alpine

ADD package.json /tmp/package.json

RUN cd /tmp && npm --pure-lockfile

ADD ./ /src

RUN cp -a /tmp/node_modules /src/

WORKDIR /src

RUN npm run-script build

## TODO rm  before deployment
EXPOSE 4000

CMD ["node", "build/src/app.js"]