FROM localhost:5000/base:latest

# docker build -t backend .
# docker tag backend localhost:5000/backend:latest

# Copy package files before run docker build command

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

RUN git clone https://github.com/JianLi-RH/MovieMaker.git SourceCode/MovieMaker
RUN pip3.10 install -r SourceCode/MovieMaker/requirements.txt