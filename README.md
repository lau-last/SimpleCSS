# SimpleCSS

![Version](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

**SimpleCSS** is a lightweight, modular, and highly customizable CSS framework designed to provide a robust foundation for modern web development. Built with **Sass** and **TypeScript**, it prioritizes flexibility and ease of maintenance, making it the perfect starting point for developers who want full control over their design system.

---

## 🇬🇧 English

### 🎯 Objectives
The primary goal of SimpleCSS is to offer a **mini-framework** that is:
- **Flexible**: Adaptable to any design specification without fighting against the framework.
- **Modular**: Organized architecture allowing you to use only what you need.
- **Developer-Friendly**: Intuitive class naming and a clean codebase.
- **Themable**: Extensive use of **CSS Custom Properties (Variables)** for easy and dynamic customization.

### 📂 Architecture
The project is structured to separate concerns and ensure scalability:

```
SimpleCSS/
├── dist/                  # Compiled production files
│   ├── css/               # Minified and standard CSS
│   └── js/                # Bundled JavaScript
├── src/                   # Source files
│   ├── scss/              # Sass styles
│   │   ├── abstract/      # Mixins, functions, animations
│   │   ├── base/          # Reset, typography, and global variables
│   │   ├── layout/        # Grid system, flexbox, containers
│   │   ├── component/     # UI components (Buttons, Cards, Navbar, etc.)
│   │   └── utility/       # Helper classes (Spacing, Colors, Borders)
│   └── ts/                # TypeScript logic for components
├── scripts/               # Build and utility scripts
└── package.json           # Dependency management and build commands
```

### 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/SimpleCSS.git
   cd SimpleCSS
   ```

2. **Install dependencies**:
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

### 🛠️ Usage

#### 1. Build the project
To compile Sass and TypeScript into the `dist` folder:
```bash
npm run build
```

#### 2. Include in your project
Link the compiled CSS and JS files in your HTML:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="dist/css/simple-css.min.css">
    <title>My Project</title>
</head>
<body>
    <!-- Your content here -->
    
    <script src="dist/js/simple-css.min.js"></script>
</body>
</html>
```

### 🎨 Customization & Extension

SimpleCSS is built to be modified.

- **Theming**: The core design tokens are defined in `src/scss/base/variable.scss`. Change colors, fonts, spacing, and border-radius here. Since these compile to CSS Variables (`:root`), many changes can even be made at runtime or scoped to specific containers.
- **Adding Components**: Create a new `.scss` file in `src/scss/component/` and import it in `src/scss/_simple-css.scss`. If it requires logic, add a corresponding `.ts` file in `src/ts/component/`.
- **Development Mode**: Watch for changes and auto-compile during development:
  ```bash
  npm run watch
  ```

### 🤝 Contribution
Contributions are welcome! If you'd like to improve SimpleCSS:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

### 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🇫🇷 Français

### 🎯 Objectifs
L'objectif principal de SimpleCSS est d'offrir un **mini-framework** qui soit :
- **Flexible** : Adaptable à n'importe quelle charte graphique sans avoir à "lutter" contre le framework.
- **Modulaire** : Une architecture organisée permettant de n'utiliser que le nécessaire.
- **Ergonomique** : Un nommage de classes intuitif et un code propre.
- **Personnalisable** : Utilisation extensive des **Propriétés Personnalisées CSS (Variables)** pour un theming facile et dynamique.

### 📂 Architecture
Le projet est structuré pour séparer les responsabilités et assurer l'évolutivité :

```
SimpleCSS/
├── dist/                  # Fichiers compilés pour la production
│   ├── css/               # CSS standard et minifié
│   └── js/                # JavaScript bundlé
├── src/                   # Fichiers sources
│   ├── scss/              # Styles Sass
│   │   ├── abstract/      # Mixins, fonctions, animations
│   │   ├── base/          # Reset, typographie et variables globales
│   │   ├── layout/        # Système de grille, flexbox, conteneurs
│   │   ├── component/     # Composants UI (Boutons, Cartes, Navbar, etc.)
│   │   └── utility/       # Classes utilitaires (Espacement, Couleurs, Bordures)
│   └── ts/                # Logique TypeScript pour les composants
├── scripts/               # Scripts de build et utilitaires
└── package.json           # Gestion des dépendances et commandes de build
```

### 🚀 Installation

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/votre-nom/SimpleCSS.git
   cd SimpleCSS
   ```

2. **Installer les dépendances** :
   Assurez-vous d'avoir Node.js installé, puis lancez :
   ```bash
   npm install
   ```

### 🛠️ Utilisation

#### 1. Compiler le projet
Pour compiler le Sass et le TypeScript vers le dossier `dist` :
```bash
npm run build
```

#### 2. Inclure dans votre projet
Liez les fichiers CSS et JS compilés dans votre HTML :
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="dist/css/simple-css.min.css">
    <title>Mon Projet</title>
</head>
<body>
    <!-- Votre contenu ici -->
    
    <script src="dist/js/simple-css.min.js"></script>
</body>
</html>
```

### 🎨 Personnalisation & Extension

SimpleCSS est conçu pour être modifié.

- **Thèmes** : Les tokens de design principaux sont définis dans `src/scss/base/variable.scss`. Modifiez les couleurs, polices, espacements et rayons de bordure ici. Comme ils sont compilés en variables CSS (`:root`), de nombreux changements peuvent même être faits à l'exécution ou limités à des conteneurs spécifiques.
- **Ajouter des composants** : Créez un nouveau fichier `.scss` dans `src/scss/component/` et importez-le dans `src/scss/_simple-css.scss`. Si cela nécessite de la logique, ajoutez un fichier `.ts` correspondant dans `src/ts/component/`.
- **Mode Développement** : Pour surveiller les changements et compiler automatiquement pendant le développement :
  ```bash
  npm run watch
  ```

### 🤝 Contribution
Les contributions sont les bienvenues ! Si vous souhaitez améliorer SimpleCSS :
1. Forkez le projet.
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`).
3. Commitez vos changements (`git commit -m 'Add some AmazingFeature'`).
4. Pushez vers la branche (`git push origin feature/AmazingFeature`).
5. Ouvrez une Pull Request.

### 📄 Licence
Distribué sous la **Licence MIT**. Voir le fichier `LICENSE` pour plus d'informations.
