FROM node:20

# docker build -t base .
# docker tag base localhost:5000/base:latest

# Download python to same folder before run docker build command
COPY Python-3.10.13.tgz .

RUN set -x && \
    apt-get update && \
    apt-get install -y locales && \
    tar -xf Python-3.10.13.tgz && \
    cd Python-3.10.13 && ./configure --enable-optimizations && make altinstall && cd .. && rm -rf Python-3.10.13 && \
    apt-get install -y git && \
    rm -rf /var/lib/apt/lists/*