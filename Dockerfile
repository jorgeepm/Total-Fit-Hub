FROM php:8.2-cli

# 1. Instalar dependencias del sistema y Node.js (para Vite/React)
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip libpq-dev \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# 2. Instalar extensiones de PHP para Laravel y PostgreSQL
RUN docker-php-ext-install pdo pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd

# 3. Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

# 4. Instalar dependencias de Laravel y compilar React
RUN composer install --no-dev --optimize-autoloader
RUN npm install
RUN npm run build

# 5. Comando de arranque: ¡Hace las migraciones automáticas y levanta la web!
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT