#
# Intended for internal KTH.se use only.
#
FROM kth-nodejs-web

ADD ["package.json", "package.json"]
RUN npm install

# Add the code and copy over the node_modules

ADD [".", "."]

ENTRYPOINT ["node", "app.js"]
