#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "===> [1/2] Building Vite React Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "===> [2/2] Installing Python FastAPI Backend Dependencies..."
cd backend
pip install --upgrade pip
pip install -r requirements.txt
cd ..

echo "===> Build completed successfully for Render!"
