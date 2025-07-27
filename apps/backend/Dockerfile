FROM python:3.11-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential libpq-dev gcc netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./apps/backend/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY ./apps/backend /app
RUN chmod +x wait-for-it.sh

ENV PYTHONUNBUFFERED=1

CMD ["./wait-for-it.sh", "db", "5432", "--", "python", "manage.py", "runserver", "0.0.0.0:8000"]