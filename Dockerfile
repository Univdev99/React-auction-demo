FROM python:3
ENV DEBIAN_FRONTEND noninteractive

COPY ./backend/requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

COPY . /app
WORKDIR /app/backend

ENV DEBIAN_FRONTEND teletype