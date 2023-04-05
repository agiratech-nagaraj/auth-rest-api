docker compose down;
git pull origin main;
docker compose up -d --remove-orphans --build;
