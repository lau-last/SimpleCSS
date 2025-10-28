# Étape 1 : Base PHP + Node
FROM php:8.2-cli

# Installer dépendances système + Node.js LTS
RUN apt-get update && apt-get install -y curl git unzip \
    && curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g typescript sass \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Définir le dossier de travail
WORKDIR /var/www/html

# Copier les fichiers du projet
COPY . .

# Exposer le port du serveur PHP
EXPOSE 8000

# Commande par défaut : compiler TS/SCSS puis lancer le serveur PHP
CMD php -S 0.0.0.0:8000 -t .