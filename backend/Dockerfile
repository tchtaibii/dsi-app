FROM python:3.9

ENV PYTHONUNBUFFERED 1
ARG BUILD_TIMEOUT=1200

WORKDIR /app

COPY ./requirements.txt /app/

# Install Python packages using pip
RUN pip install --upgrade pip && \
    pip install mysqlclient && \
    pip install --timeout $BUILD_TIMEOUT -r requirements.txt

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]