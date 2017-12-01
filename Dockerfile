FROM python:3
ENV DEBIAN_FRONTEND noninteractive

RUN mkdir /code
RUN mkdir /code/backend
WORKDIR /code

RUN mkdir /code/log

COPY ./backend/requirements.txt /code/backend/requirements.txt
RUN pip install -r /code/backend/requirements.txt

RUN apt-get update && apt-get install -y --no-install-recommends apt-utils
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash
RUN apt-get install nodejs

RUN rm -Rf /code/backend
COPY . /code

ADD ./docker/nginx /etc/nginx/conf.d

ENV DEBIAN_FRONTEND teletype