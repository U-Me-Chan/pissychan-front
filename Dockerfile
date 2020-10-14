FROM archlinux/base

ENV NODE_ENV="production"

RUN pacman --noconfirm -Syyuu
RUN pacman --noconfirm -S nodejs npm
RUN mkdir -p /tmp/workspace
COPY . /tmp/workspace
WORKDIR /tmp/workspace
RUN npm install

CMD npm start
