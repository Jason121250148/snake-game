FROM node

# Use Alibaba's NPM mirror
RUN npm set registry https://registry.npm.taobao.org/

# creat workdir
RUN mkdir -p /usr/projects/snake-game
WORKDIR /usr/projects/snake-game

# Install dependencies
COPY package.json /usr/projects/snake-game
RUN npm install

# copy other codes and resources
COPY . /usr/projects/snake-game

EXPOSE 8080
# ENTRYPOINT diff CMD CDM can be overrided
CMD [ "npm", "start" ]
