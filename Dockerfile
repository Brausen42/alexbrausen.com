FROM nginx:alpine

COPY gol/* /usr/share/nginx/html/gol/
COPY resume/* /usr/share/nginx/html/resume/
COPY dist/build.js /usr/share/nginx/html/dist/build.js
COPY index.html /usr/share/nginx/html/index.html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080