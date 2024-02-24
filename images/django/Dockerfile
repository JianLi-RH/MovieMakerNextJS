FROM localhost:5000/base:latest

WORKDIR /app
COPY . ./

RUN ln /usr/local/bin/python3.10 /usr/local/bin/python
RUN python -m pip install Django==5.0.2
RUN django-admin startproject gallery

RUN cp -f settings.py urls.py /app/gallery/gallery && \
    mkdir public

VOLUME public/

USER root

EXPOSE 8000

ENV PORT 8000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD [ "python", "gallery/manage.py", "runserver", "0.0.0.0:8000"]