#!/bin/bash
set -e

echo "🚀 Starting entrypoint script..."

# Enable Apache configurations
a2ensite 000-default
a2enconf global

# Fix Laravel storage & logs permissions
echo "🔧 Fixing permissions for Laravel storage..."
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Ensure Laravel logs directory is writable
mkdir -p /var/www/storage/logs
chown -R www-data:www-data /var/www/storage/logs

# Install Composer dependencies (only if not already installed)
if [ ! -d "vendor" ]; then
    echo "📦 Installing Composer dependencies..."
    composer install --no-dev --optimize-autoloader
else
    echo "✅ Composer dependencies already installed, skipping..."
fi

# Wait for MySQL to be ready
until timeout 1 bash -c "echo > /dev/tcp/$DB_HOST/3306"; do
    echo "⏳ Waiting for database connection..."
    sleep 2
done
echo "✅ Database is available!"

# Run database migrations if necessary
echo "🔄 Running migrations if necessary..."
php artisan migrate --force || echo "⚠️ Migrations failed or already applied."

echo "🔄 Install Node dependencies & build frontend..."
npm install && npm run build

# Clear and optimize Laravel cache
php artisan optimize:clear
php artisan optimize

# Start Apache in the foreground (no need to restart manually)
echo "🚀 Starting Apache..."
exec apache2-foreground
