FROM python:3.9

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY ./requirements.txt /app/

# Install Python packages using pip
RUN pip install --upgrade pip && \
    pip install mysqlclient && \
    pip install -r requirements.txt

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]