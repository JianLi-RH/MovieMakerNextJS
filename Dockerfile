FROM node:20 AS base

WORKDIR /app
COPY . ./

RUN set -x && \
    tar -xf Python.tgz && \
    cd Python && ./configure --enable-optimizations && make altinstall && cd .. && rm -rf Python

RUN python3.10 init.py
RUN npm ci && npm run build


USER root

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"
CMD ["npm", "run", "start", "--loglevel=verbose"]