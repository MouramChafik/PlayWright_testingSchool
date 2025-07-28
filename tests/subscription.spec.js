// @ts-check
import { test, expect } from "@playwright/test";
const {
  performLogin,
  navigateToLogin,
  checkLoginState,
} = require("../utils/auth.js");

test.describe("Subscription Tests - Testing School", () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page de connexion
    await navigateToLogin(page);

    // Utiliser la fonction de login existante
    await performLogin(page, "test@gmail.com", "test@gmail.com");

    // Vérifier que la connexion a réussi
    const { isWelcome, isPlan } = await checkLoginState(page);

    if (isWelcome) {
      console.log("✅ Login successful - Redirected to welcome page");
    } else if (isPlan) {
      console.log("✅ Login successful - Redirected to plan selection page");
    } else {
      throw new Error(
        "Neither welcome nor plan title found - Login may have failed"
      );
    }
  });

  test("should verify login works before testing subscription", async ({
    page,
  }) => {
    // Vérifier l'état de connexion
    const { isWelcome, isPlan } = await checkLoginState(page);

    if (isWelcome) {
      console.log("✅ Login successful - User is on welcome page");
    } else if (isPlan) {
      console.log("✅ Login successful - User is on plan selection page");
    } else {
      throw new Error("Login verification failed - No expected title found");
    }

    // Fermer le navigateur après le test
    await page.close();
  });

  test("should navigate to subscription page after login", async ({ page }) => {
    // Vérifier l'état de connexion
    const { isWelcome, isPlan } = await checkLoginState(page);

    if (isWelcome || isPlan) {
      console.log(
        "✅ Login verified, ready to implement subscription navigation"
      );
    } else {
      throw new Error("Login state could not be verified");
    }

    // TODO: Ajouter la navigation vers la page d'abonnement

    // Fermer le navigateur après le test
    await page.close();
  });

  test("should find subscription elements on the page", async ({ page }) => {
    // Vérifier l'état de connexion
    const { isWelcome, isPlan } = await checkLoginState(page);

    if (isWelcome || isPlan) {
      console.log("✅ Login verified, ready to locate subscription elements");
    } else {
      throw new Error("Cannot verify login state");
    }

    // TODO: Une fois connecté, chercher les éléments d'abonnement

    // Fermer le navigateur après le test
    await page.close();
  });

  test("should complete full subscription process", async ({ page }) => {
    console.log("🔄 Starting complete subscription process...");

    // Vérifier l'état de connexion
    const { isWelcome, isPlan } = await checkLoginState(page);

    if (isWelcome || isPlan) {
      console.log("✅ Login verified, proceeding with subscription");
    } else {
      throw new Error("Cannot verify login state");
    }

    // Debug: Afficher l'URL actuelle et le titre de la page
    console.log("Current URL:", await page.url());
    console.log("Page title:", await page.title());

    // Debug: Chercher tous les boutons contenant "S'abonner"
    const allButtons = await page.locator("button").all();
    console.log("Total buttons found:", allButtons.length);

    for (let i = 0; i < allButtons.length; i++) {
      const buttonText = await allButtons[i].textContent();
      if (buttonText && buttonText.includes("abonner")) {
        console.log(`Button ${i}: "${buttonText}"`);
      }
    }

    // Essayer de trouver le bouton S'abonner avec un sélecteur plus simple
    console.log("🔄 Looking for S'abonner button...");
    const subscribeButton = page.locator("button", { hasText: "S'abonner" });

    if ((await subscribeButton.count()) > 0) {
      console.log("✅ Subscribe button found with text selector");
      await subscribeButton.first().click();
      console.log("✅ Subscribe button clicked");
    } else {
      // Si pas trouvé, essayer un autre sélecteur
      const subscribeButton2 = page.locator('button:has-text("S\'abonner")');
      if ((await subscribeButton2.count()) > 0) {
        console.log("✅ Subscribe button found with has-text selector");
        await subscribeButton2.first().click();
        console.log("✅ Subscribe button clicked");
      } else {
        console.log("❌ No subscribe button found");
        // Prendre une capture d'écran pour débugger
        await page.screenshot({
          path: "debug-subscription-page.png",
          fullPage: true,
        });
        throw new Error("Subscribe button not found");
      }
    }

    // Le reste du test continue seulement si le bouton a été trouvé et cliqué
    // 2. Attendre que le titre "Moyen de paiement" soit visible
    console.log("🔄 Waiting for payment method section...");
    const paymentMethodHeading = page.locator(
      "h2.PaymentMethod-Heading.Text.Text-color--gray800.Text-fontSize--16.Text-fontWeight--500"
    );
    await paymentMethodHeading.waitFor({ state: "visible" });
    console.log("✅ Payment method section loaded");

    // Attendre un peu pour que la page se charge complètement
    await page.waitForTimeout(2000);

    // 3. Remplir le numéro de carte
    console.log("🔄 Filling card number...");
    const cardNumberInput = page.locator("#cardNumber");
    await cardNumberInput.waitFor({ state: "visible" });
    await cardNumberInput.fill("4242 4242 4242 4242");
    console.log("✅ Card number filled");

    // 4. Remplir la date d'expiration
    console.log("🔄 Filling expiry date...");
    const cardExpiryInput = page.locator("#cardExpiry");
    await cardExpiryInput.waitFor({ state: "visible" });
    await cardExpiryInput.fill("04/26");
    console.log("✅ Expiry date filled");

     // 4. Remplir la date d'expiration
    console.log("🔄 Filling expiry date...");
    const cardCvcInput = page.locator("#cardCvc");
    await cardCvcInput.waitFor({ state: "visible" });
    await cardCvcInput.fill("424");
    console.log("✅ CVC filled");

    // 5. Remplir le nom complet
    console.log("🔄 Filling billing name...");
    const billingNameInput = page.locator("#billingName");
    await billingNameInput.waitFor({ state: "visible" });
    await billingNameInput.fill("james davide");
    console.log("✅ Billing name filled");

    // 6. Sélectionner la France comme pays
    console.log("🔄 Selecting France as country...");
    const countrySelect = page.locator("#billingCountry");
    await countrySelect.waitFor({ state: "visible" });
    await countrySelect.selectOption("FR");
    console.log("✅ France selected");

    // Attendre un peu avant de soumettre
    await page.waitForTimeout(1000);

    // 7. Cliquer sur le bouton de soumission
    console.log("🔄 Clicking submit button...");
    const submitButton = page.locator(".SubmitButton-IconContainer");
    await submitButton.waitFor({ state: "visible" });
    await submitButton.click();
    console.log("✅ Submit button clicked");

    // 8. Attendre le message de paiement réussi
    console.log("🔄 Waiting for payment success message...");
    const successTitle = page.locator(
      "h1.text-3xl.font-bold.text-gray-900.mb-4",
      { hasText: "Paiement réussi !" }
    );
    await successTitle.waitFor({ state: "visible", timeout: 30000 });
    console.log("✅ Payment success message displayed");

    // 9. Cliquer sur "Accéder au dashboard"
    console.log("🔄 Clicking access dashboard button...");
    const dashboardButton = page.locator(
      'a.w-full.bg-blue-600.hover\\:bg-blue-700.text-white.py-3.px-6.rounded-lg.font-semibold.transition-colors.duration-200.flex.items-center.justify-center.space-x-2[href="/dashboard"]'
    );
    await dashboardButton.waitFor({ state: "visible" });
    await dashboardButton.click();
    console.log("✅ Dashboard button clicked");

    // 10. Vérifier que nous sommes sur le dashboard avec le message attendu
    console.log("🔄 Verifying dashboard page...");
    const dashboardMessage = page.locator("p.text-gray-600.mt-2", {
      hasText: "Continuez votre parcours d'apprentissage",
    });
    await dashboardMessage.waitFor({ state: "visible", timeout: 15000 });
    console.log("✅ Dashboard page loaded successfully");

    // Vérification finale
    expect(await dashboardMessage.isVisible()).toBe(true);
    console.log("🎉 Complete subscription process test passed!");

    // Fermer le navigateur après le test
    await page.close();
  });

  // Ajouter des tests pour les éléments d'abonnement
});

// Configuration pour exécuter uniquement sur Chrome
test.use({
  browserName: "chromium",
});
