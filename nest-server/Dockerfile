FROM node:18

WORKDIR /usr/src/app

COPY . .

EXPOSE 8070

CMD yarn install && \
    yarn prisma generate &&\
    yarn prisma migrate dev &&\
    yarn start:prod
