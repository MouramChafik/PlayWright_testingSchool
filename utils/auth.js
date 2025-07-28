// @ts-check

/**
 * Fonction utilitaire pour effectuer une connexion
 * @param {import('@playwright/test').Page} page - La page Playwright
 * @param {string} email - Email de connexion
 * @param {string} password - Mot de passe
 */
async function performLogin(
  page,
  email = "test@gmail.com",
  password = "test@gmail.com"
) {
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.locator('button[type="submit"]').click();

  // Vérifier que la connexion a réussi en cherchant soit le titre de bienvenue soit le titre de plan
  const welcomeTitle = page.locator("h1.text-3xl.font-bold.text-gray-900.mb-2");
  const planTitle = page.locator("h1.text-4xl.font-bold.text-gray-900.mb-4");

  // Attendre qu'au moins un des deux titres apparaisse
  try {
    await Promise.race([
      welcomeTitle.waitFor({ state: "visible", timeout: 10000 }),
      planTitle.waitFor({ state: "visible", timeout: 10000 }),
    ]);
  } catch (error) {
    throw new Error("Login failed - Neither welcome nor plan title appeared");
  }
}

/**
 * Fonction utilitaire pour naviguer vers la page de connexion
 * @param {import('@playwright/test').Page} page - La page Playwright
 */
async function navigateToLogin(page) {
  // Naviguer vers la page d'accueil
  await page.goto("https://testing-school.netlify.app/");

  // Cliquer sur le lien "Connexion" dans la navbar
  const loginLink = page.locator('a[href="/login"]:has-text("Connexion")');
  await loginLink.waitFor({ state: "visible" });
  await loginLink.click();

  // Attendre que la page de connexion se charge
  await page.waitForURL("**/login");
}

/**
 * Fonction utilitaire pour vérifier l'état de connexion
 * @param {import('@playwright/test').Page} page - La page Playwright
 * @returns {Promise<{isWelcome: boolean, isPlan: boolean}>}
 */
async function checkLoginState(page) {
  const welcomeTitle = page.locator("h1.text-3xl.font-bold.text-gray-900.mb-2");
  const planTitle = page.locator("h1.text-4xl.font-bold.text-gray-900.mb-4");

  const isWelcome = await welcomeTitle.isVisible().catch(() => false);
  const isPlan = await planTitle.isVisible().catch(() => false);

  return { isWelcome, isPlan };
}

module.exports = {
  performLogin,
  navigateToLogin,
  checkLoginState,
};
