FROM php:7.4-fpm

WORKDIR /var/www/html/mycartoonboxbackend

RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip

# Installation de Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Activation des extensions PHP nécessaires
RUN docker-php-ext-configure zip \
    && docker-php-ext-install zip pdo_mysql
    
RUN docker-php-ext-install pdo pdo_mysql

COPY . .


EXPOSE 8000
CMD php artisan optimize:clear
CMD php artisan serve --host=0.0.0.0 --port=8000
