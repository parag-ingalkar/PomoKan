# backend/Dockerfile

FROM python:3.12-slim

WORKDIR /app

# Install uv
RUN pip install --no-cache-dir uv

COPY pyproject.toml .
COPY requirements.txt .
COPY uv.lock .

# Install dependencies with uv
RUN uv pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"] 