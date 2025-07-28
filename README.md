# Test Playwright - Projet de Tests End-to-End

Ce projet a été configuré avec Playwright pour effectuer des tests end-to-end automatisés sur l'applications web: https://testing-school.netlify.app/.


https://github.com/user-attachments/assets/d30400fb-396a-41e2-a0c9-464c8072012a


## 📋 Table des matières

- [Installation](#installation)
- [Configuration](#configuration)
- [Structure du projet](#structure-du-projet)
- [Tests disponibles](#tests-disponibles)
- [Commandes principales](#commandes-principales)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Configuration avancée](#configuration-avancée)
- [CI/CD](#cicd)

## 🚀 Installation

Le projet a été initialisé avec Playwright et toutes les dépendances sont déjà installées :

```bash
# Installation initiale (déjà effectuée)
npm init playwright@latest

# Installation des dépendances (si nécessaire)
npm install
```

### Navigateurs installés

Les navigateurs suivants ont été téléchargés automatiquement :

- **Chromium** 139.0.7258.5
- **Firefox** 140.0.2
- **WebKit** (Safari) - version spéciale pour macOS 13
- **FFMPEG** pour l'enregistrement vidéo

## ⚙️ Configuration

### Fichier de configuration : `playwright.config.js`

Le projet est configuré avec :

- **Langage** : JavaScript
- **Navigateurs de test** : Chromium, Firefox, WebKit
- **Dossier de tests** : `tests/`
- **Dossier d'exemples** : `tests-examples/`
- **Rapports** : HTML et JSON
- **Screenshots** : Automatiques en cas d'échec
- **Vidéos** : Enregistrement automatique des échecs

## 📁 Structure du projet

```
test-PlayWright/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI/CD GitHub Actions
├── tests/
│   └── example.spec.js             # Tests de base
├── tests-examples/
│   └── demo-todo-app.spec.js       # Tests complets d'une Todo App
├── playwright.config.js            # Configuration Playwright
├── package.json                    # Dépendances du projet
└── README.md                       # Cette documentation
```

## 🧪 Tests disponibles

### 1. Tests de base (`tests/example.spec.js`)

Tests simples pour vérifier la configuration de base.

### 2. Tests Todo App (`tests-examples/demo-todo-app.spec.js`)

Suite complète de tests pour une application Todo comprenant :

#### Fonctionnalités testées :

- ✅ **Création de todos** : Ajout d'éléments à la liste
- ✅ **Gestion d'état** : Marquer comme complété/non-complété
- ✅ **Édition** : Modification d'éléments existants
- ✅ **Suppression** : Effacement d'éléments
- ✅ **Filtrage** : Affichage par statut (Tous, Actifs, Complétés)
- ✅ **Persistance** : Sauvegarde dans le localStorage
- ✅ **Navigation** : Routage et bouton retour
- ✅ **Compteur** : Affichage du nombre d'éléments
- ✅ **Actions groupées** : Marquer tout comme complété

#### Tests spécifiques inclus :

1. **New Todo** - 3 tests

   - Ajout d'éléments
   - Nettoyage du champ de saisie
   - Ordre d'ajout

2. **Mark all as completed** - 3 tests

   - Marquer tous comme complétés
   - Démarquer tous
   - Mise à jour de l'état global

3. **Item** - 3 tests

   - Marquer individuellement
   - Démarquer individuellement
   - Édition d'éléments

4. **Editing** - 5 tests

   - Masquage des contrôles pendant l'édition
   - Sauvegarde sur perte de focus
   - Nettoyage du texte
   - Suppression sur texte vide
   - Annulation avec Escape

5. **Counter** - 1 test

   - Affichage du nombre d'éléments

6. **Clear completed button** - 3 tests

   - Affichage du texte correct
   - Suppression des éléments complétés
   - Masquage quand aucun élément complété

7. **Persistence** - 1 test

   - Sauvegarde des données après rechargement

8. **Routing** - 5 tests
   - Affichage des éléments actifs
   - Navigation avec bouton retour
   - Affichage des éléments complétés
   - Affichage de tous les éléments
   - Mise en surbrillance du filtre actuel

## 🎯 Commandes principales

### Exécution des tests

```bash
# Exécuter tous les tests
npx playwright test

# Exécuter les tests avec interface utilisateur
npx playwright test --ui

# Exécuter sur un navigateur spécifique
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Exécuter un fichier de test spécifique
npx playwright test example
npx playwright test demo-todo-app

# Mode débogage
npx playwright test --debug

# Tests en mode headed (visible)
npx playwright test --headed
```

### Génération de tests

```bash
# Générateur automatique de tests (Codegen)
npx playwright codegen

# Codegen sur un site spécifique
npx playwright codegen https://demo.playwright.dev/todomvc
```

### Rapports et résultats

```bash
# Ouvrir le rapport HTML
npx playwright show-report

# Exécuter les tests et ouvrir le rapport
npx playwright test && npx playwright show-report
```

## 💡 Exemples d'utilisation

### Test simple de navigation

```javascript
import { test, expect } from "@playwright/test";

test("navigation de base", async ({ page }) => {
  await page.goto("https://example.com");
  await expect(page).toHaveTitle(/Example/);
});
```

### Test d'interaction avec formulaire

```javascript
test("remplir un formulaire", async ({ page }) => {
  await page.goto("https://demo.playwright.dev/todomvc");

  const newTodo = page.getByPlaceholder("What needs to be done?");
  await newTodo.fill("Mon nouveau todo");
  await newTodo.press("Enter");

  await expect(page.getByTestId("todo-title")).toHaveText(["Mon nouveau todo"]);
});
```

### Techniques de localisation utilisées

Le projet utilise plusieurs méthodes de localisation Playwright :

- `page.getByPlaceholder()` - Par texte de placeholder
- `page.getByTestId()` - Par attribut data-testid
- `page.getByRole()` - Par rôle ARIA
- `page.getByText()` - Par contenu textuel
- `page.getByLabel()` - Par libellé
- `page.locator()` - Sélecteur CSS personnalisé

## 🔧 Configuration avancée

### Navigateurs personnalisés

Pour modifier les navigateurs de test, éditez `playwright.config.js` :

```javascript
module.exports = {
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    // Ajouter d'autres configurations...
  ],
};
```

### Variables d'environnement

Créez un fichier `.env` pour les configurations spécifiques :

```bash
BASE_URL=https://demo.playwright.dev/todomvc
TIMEOUT=30000
HEADLESS=true
```

## 🚀 CI/CD

### GitHub Actions

Le workflow GitHub Actions (`.github/workflows/playwright.yml`) est configuré pour :

- ✅ Exécution automatique sur push et pull request
- ✅ Tests sur Ubuntu latest
- ✅ Installation automatique des navigateurs
- ✅ Upload des rapports d'échec
- ✅ Artifacts des screenshots et vidéos

### Commandes CI

```bash
# Installation pour CI
npm ci
npx playwright install --with-deps

# Exécution en CI
npx playwright test --reporter=github
```

## 📊 Fonctionnalités de test avancées

### Fonctions utilitaires incluses

Le projet inclut des fonctions helper pour :

- `createDefaultTodos()` - Création de todos par défaut
- `checkNumberOfTodosInLocalStorage()` - Vérification du localStorage
- `checkNumberOfCompletedTodosInLocalStorage()` - Comptage des complétés
- `checkTodosInLocalStorage()` - Vérification de contenu spécifique

### Hooks de test

- `test.beforeEach()` - Configuration avant chaque test
- `test.afterEach()` - Nettoyage après chaque test
- `test.describe()` - Groupement logique des tests

## 🐛 Débogage

### Options de débogage

```bash
# Mode débogage avec Playwright Inspector
npx playwright test --debug

# Mode headed pour voir l'exécution
npx playwright test --headed

# Screenshots automatiques
npx playwright test --screenshot=only-on-failure

# Traces pour analyse détaillée
npx playwright test --trace=on
```

### Analyse des échecs

Les échecs de test génèrent automatiquement :

- Screenshots de l'état final
- Vidéos de l'exécution (optionnel)
- Traces détaillées
- Logs de console

## 📚 Ressources utiles

- [Documentation officielle Playwright](https://playwright.dev/docs/intro)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Exemples de tests](https://github.com/microsoft/playwright/tree/main/tests)
- [Best practices](https://playwright.dev/docs/best-practices)

## 🎭 Conclusion

Ce projet est maintenant prêt pour le développement de tests end-to-end robustes. Tous les exemples et configurations nécessaires sont en place pour commencer à écrire vos propres tests.

Pour commencer rapidement :

```bash
# Lancer les tests d'exemple
npx playwright test

# Générer de nouveaux tests
npx playwright codegen

# Voir les résultats
npx playwright show-report
```

Happy testing! 🎭
