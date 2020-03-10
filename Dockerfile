FROM node:carbon
WORKDIR /usr/src/app/
ENV TZ=America/Chicago
RUN curl http://loe.outlawdesigns.io/Documents/LOE_MX/certs/outlawdesigns_wildcard/fullchain.pem > fullchain.pem
RUN curl http://loe.outlawdesigns.io/Documents/LOE_MX/certs/outlawdesigns_wildcard/privkey.pem > privkey.pem
RUN mkdir -p /mnt/LOE/log
COPY . .
RUN npm install
RUN sed -i 's/DBUSER:'.*'/DBUSER:test/' /usr/src/app/node_module/outlawdesigns.io.noderecord/config.js
RUN sed -i 's/DBHOST:'.*'/DBHOST:localhost/' /usr/src/app/node_module/outlawdesigns.io.noderecord/config.js
RUN sed -i 's/DBPASS:'.*'/DBPASS:test/' /usr/src/app/node_module/outlawdesigns.io.noderecord/config.js
EXPOSE 9690
CMD ["/bin/sh","-c","npm start > /mnt/LOE/log/fileservice.api.log"]
