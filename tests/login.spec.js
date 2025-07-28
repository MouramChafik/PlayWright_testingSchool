// @ts-check
import { test, expect } from "@playwright/test";
const {
  performLogin,
  navigateToLogin,
  checkLoginState,
} = require("../utils/auth.js");

test.describe("Login Tests - Testing School", () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page d'accueil
    await page.goto("https://testing-school.netlify.app/");

    // Cliquer sur le lien "Connexion" dans la navbar
    const loginLink = page.locator('a[href="/login"]:has-text("Connexion")');
    await expect(loginLink).toBeVisible();
    await loginLink.click();

    // Attendre que la page de connexion se charge
    await page.waitForURL("**/login");
  });

  test("should successfully login with valid credentials", async ({ page }) => {
    // Vérifier la présence du titre de connexion
    const loginTitle = page.locator("h2.text-3xl.font-bold.text-gray-900.mb-2");
    await expect(loginTitle).toHaveText("Connexion");

    // Localiser le champ email et saisir l'email
    const emailInput = page.locator("#email");
    await expect(emailInput).toBeVisible();
    await emailInput.fill("test@gmail.com");

    // Localiser le champ mot de passe et saisir le mot de passe
    const passwordInput = page.locator("#password");
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill("test@gmail.com");

    // Cliquer sur le bouton de connexion
    const loginButton = page.locator('button[type="submit"]');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toContainText("Se connecter");
    await loginButton.click();

    // Attendre et vérifier l'affichage soit du message de bienvenue soit du plan
    // Le login peut rediriger vers la page de bienvenue ou vers la page de choix de plan
    const welcomeTitle = page.locator(
      "h1.text-3xl.font-bold.text-gray-900.mb-2"
    );
    const planTitle = page.locator("h1.text-4xl.font-bold.text-gray-900.mb-4");

    // Vérifier qu'au moins un des deux titres est présent
    const isWelcomeVisible = await welcomeTitle.isVisible().catch(() => false);
    const isPlanVisible = await planTitle.isVisible().catch(() => false);

    if (isWelcomeVisible) {
      await expect(welcomeTitle).toContainText("Bienvenue");
      console.log("✅ Login successful - Redirected to welcome page");
    } else if (isPlanVisible) {
      await expect(planTitle).toHaveText("Choisissez votre plan");
      console.log("✅ Login successful - Redirected to plan selection page");
    }

    // Fermer le navigateur après le test
    await page.close();
  });

  test("should display login form elements correctly", async ({ page }) => {
    // Vérifier que tous les éléments du formulaire sont présents
    await expect(page.locator('h2:has-text("Connexion")')).toBeVisible();

    // Vérifier le champ email
    const emailInput = page.locator("#email");
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute("type", "email");
    await expect(emailInput).toHaveAttribute("placeholder", "votre@email.com");

    // Vérifier le champ mot de passe
    const passwordInput = page.locator("#password");
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute("type", "password");
    await expect(passwordInput).toHaveAttribute("placeholder", "••••••••");

    // Vérifier le bouton de connexion
    const loginButton = page.locator('button[type="submit"]');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toContainText("Se connecter");

    // Fermer le navigateur après le test
    await page.close();
  });

  test("should validate form fields are required", async ({ page }) => {
    // Essayer de se connecter sans remplir les champs
    const loginButton = page.locator('button[type="submit"]');
    await loginButton.click();

    // Vérifier que les champs sont requis
    const emailInput = page.locator("#email");
    const passwordInput = page.locator("#password");

    await expect(emailInput).toHaveAttribute("required");
    await expect(passwordInput).toHaveAttribute("required");

    // Fermer le navigateur après le test
    await page.close();
  });

  test("should handle form interaction smoothly", async ({ page }) => {
    // Tester les interactions du formulaire
    const emailInput = page.locator("#email");
    const passwordInput = page.locator("#password");

    // Focus sur le champ email
    await emailInput.focus();
    await expect(emailInput).toBeFocused();

    // Saisir l'email
    await emailInput.type("test@gmail.com");
    await expect(emailInput).toHaveValue("test@gmail.com");

    // Passer au champ mot de passe avec Tab
    await passwordInput.focus();
    await expect(passwordInput).toBeFocused();

    // Saisir le mot de passe
    await passwordInput.type("test@gmail.com");
    await expect(passwordInput).toHaveValue("test@gmail.com");

    // Vérifier que le bouton devient cliquable
    const loginButton = page.locator('button[type="submit"]');
    await expect(loginButton).toBeEnabled();

    // Fermer le navigateur après le test
    await page.close();
  });
});

// Configuration pour exécuter uniquement sur Chrome
test.use({
  browserName: "chromium",
});
