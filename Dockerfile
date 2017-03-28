#
# Intended for internal KTH.se use only.

# To run in Docker use:
# docker pull patricjansson/express-4-tutorial:v0.1
# docker run -p 80:3000 patricjansson/express-4-tutorial:v0.1
#
FROM kth-nodejs-web

ADD ["package.json", "package.json"]
RUN npm install

# Add the code and copy over the node_modules

ADD [".", "."]

ENTRYPOINT ["node", "app.js"]
