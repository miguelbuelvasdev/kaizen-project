FROM python:3.11-slim

# Instalar dependencias del sistema necesarias para matplotlib y otros
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libffi-dev \
    libssl-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Crear usuario no-root para seguridad
RUN useradd --create-home --shell /bin/bash app \
    && mkdir -p /app \
    && chown -R app:app /app

# Establecer directorio de trabajo
WORKDIR /app

# Cambiar a usuario no-root
USER app

# Copiar requirements e instalar dependencias Python
COPY --chown=app:app requirements.txt .
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY --chown=app:app . .

# Crear directorios necesarios
RUN mkdir -p reports static

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Exponer puerto
EXPOSE 8000

# Comando para ejecutar la aplicación
# En desarrollo: usa --reload
# En producción: usa múltiples workers
CMD ["sh", "-c", "if [ \"$ENV\" = \"development\" ]; then uvicorn main:app --host 0.0.0.0 --port 8000 --reload; else uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4; fi"]
