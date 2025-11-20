# Use a minimal Python image
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Copy ONLY requirements first (for better caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy all remaining project files
COPY . .

# Expose FastAPI/Uvicorn port
EXPOSE 8000

# Run FastAPI app with Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
