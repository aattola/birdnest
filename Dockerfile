FROM node:18-alpine

ENV NODE_ENV="production"

WORKDIR /app/backend
COPY package.json ./
COPY yarn.lock ./
# --ignore-optional --ignore-engines --production
RUN yarn install || \
  ((if [ -f yarn-error.log ]; then \
      cat yarn-error.log; \
    fi) && false)

COPY . .

RUN yarn build

CMD node build/index.js

