FROM node:20 AS base

WORKDIR /app
COPY . ./

RUN set -x && \
    curl -sSl https://www.python.org/ftp/python/3.10.13/Python-3.10.13.tgz --output /tmp/Python-3.10.13.tgz && \
    tar -xf /tmp/Python-3.10.13.tgz && \
    cd Python-3.10.13 && ./configure --enable-optimizations && make altinstall && cd .. && rm -rf Python-3.10.13

RUN python3.10 init.py
RUN npm run build


USER root

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"
CMD ["npm", "run", "start", "--loglevel=verbose"]