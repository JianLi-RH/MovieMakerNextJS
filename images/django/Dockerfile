FROM localhost:5000/base:latest

WORKDIR /app
COPY . ./

RUN python3.10 -m pip install Django==5.0.2
RUN django-admin startproject gallery

RUN cp settings.py /app/gallery && \
    cp urls.py /app/gallery && \
    mkdir public

VOLUME public/

USER root

EXPOSE 8000

ENV PORT 8000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD [ "python", "./manage.py", "runserver", "0.0.0.0:8000"]