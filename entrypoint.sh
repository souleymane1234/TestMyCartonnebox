#!/bin/sh

# Debug: Liste les fichiers dans le dossier /var/www/html/mycartoonboxbackend
ls -l /var/www/html/mycartoonboxbackend

# Nettoyer et optimiser le cache
php artisan optimize:clear

php artisan serve --host=0.0.0.0 --port=8000

# npm install

# npm run prod

# Lancer les migrations (en production, cette ligne peut être commentée si les migrations ne doivent pas être exécutées automatiquement)
# php artisan migrate --force

# Démarrer PHP-FPM pour servir Laravel via Nginx
# php-fpm

