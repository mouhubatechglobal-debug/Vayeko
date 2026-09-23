import { expect, test } from '@playwright/test';

test.describe('Services & WhatsApp', () => {
  test('liste et accès à une fiche service', async ({ page }) => {
    await page.goto('/services');
    await expect(page.getByRole('heading', { level: 1, name: 'Services' })).toBeVisible();

    // Première carte disponible (démo ou données réelles)
    const firstCard = page.locator('a[href^="/services/"]').first();
    if (await firstCard.count()) {
      await firstCard.click();
      await expect(page).toHaveURL(/\/services\/.+/);
    }
  });

  test('le bouton WhatsApp génère un lien wa.me propre', async ({ page }) => {
    await page.goto('/services');
    const waLink = page.locator('a[href^="https://wa.me/"]').first();
    if (await waLink.count()) {
      const href = await waLink.getAttribute('href');
      expect(href).toMatch(/^https:\/\/wa\.me\/228\d{8}(\?text=.+)?$/);
      // Jamais de lien suspect
      expect(href).not.toContain('javascript:');
    }
  });

  test('recherche globale affiche les onglets', async ({ page }) => {
    await page.goto('/recherche?q=coiffure');
    await expect(page.getByRole('button', { name: 'Tout' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Services' })).toBeVisible();
  });
});
