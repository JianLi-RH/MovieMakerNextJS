FROM node:20 AS base

WORKDIR /app
COPY . ./

RUN set -x && \
    tar -xf Python-3.10.13.tgz && \
    cd Python-3.10.13 && ./configure --enable-optimizations && make altinstall && cd .. && rm -rf Python-3.10.13 && \
    apt-get install -y git && \
    rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/JianLi-RH/MovieMaker.git SourceCode/MovieMaker

RUN python3.10 init.py
RUN npm ci && npm run build


USER root

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"
CMD ["npm", "run", "start", "--loglevel=verbose"]