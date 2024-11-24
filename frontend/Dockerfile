FROM nginx:alpine
WORKDIR /app

RUN rm -rf /usr/share/nginx/html/*

COPY ./dist/* /app/
COPY ./app/* /usr/share/nginx/html/

EXPOSE 80





