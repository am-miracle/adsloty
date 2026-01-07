#!/bin/bash
# Setup script for adsloty database

set -e

echo "=== Adsloty Database Setup ==="

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    echo "Example: export DATABASE_URL=postgres://user:password@localhost:5432/adsloty"
    exit 1
fi

# Check if sqlx-cli is installed
if ! command -v sqlx &> /dev/null; then
    echo "Installing sqlx-cli..."
    cargo install sqlx-cli --no-default-features --features postgres
fi

echo "Creating database if it doesn't exist..."
sqlx database create || true

echo "Running migrations..."
sqlx migrate run

echo "Generating SQLx query cache for offline compile-time checking..."
cargo sqlx prepare

echo ""
echo "=== Setup Complete ==="
echo "The .sqlx directory now contains query metadata for compile-time checking."
echo "Commit the .sqlx directory to version control."
