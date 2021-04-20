FROM python:3.9

RUN mkdir -p /opt/

ADD requirements.txt /opt/

RUN pip install --upgrade pip

RUN pip install -r /opt/requirements.txt

ADD app /opt/app

WORKDIR /opt/app

ENTRYPOINT ["/opt/app/entrypoint.sh"]

CMD python manage.py runserver 0.0.0.0:8000