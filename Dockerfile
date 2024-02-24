FROM localhost:5000/backend:latest

WORKDIR /app
COPY . ./

RUN python3.10 init.py
RUN npm run build
VOLUME public/

USER root

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"
CMD ["npm", "run", "start", "--loglevel=verbose"]