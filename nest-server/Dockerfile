FROM node:18

WORKDIR /usr/src/app

COPY . .

EXPOSE 8070

CMD yarn install && \
    yarn prisma generate &&\
    yarn prisma migrate deploy &&\
    node dist/prisma/seed.js &&\
    yarn start:prod
