import { expect, test } from '@playwright/test';

/**
 * Parcours page d'accueil (mode démo ou Supabase configuré).
 */
test.describe("Page d'accueil", () => {
  test('affiche le hero, la recherche, les catégories et les produits', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Vayeko/);
    await expect(page.getByRole('heading', { level: 1, name: 'Vayeko' })).toBeVisible();
    await expect(page.getByText('Le Togo à portée de main !')).toBeVisible();

    // Barre de recherche + badge local
    await expect(page.getByPlaceholder('Que recherchez-vous ?')).toBeVisible();
    await expect(page.getByText('100% Togolais')).toBeVisible();

    // Accès rapide
    await expect(page.getByRole('navigation', { name: 'Accès rapide aux sections' })).toBeVisible();

    // Catégories et produits
    await expect(page.getByRole('heading', { name: 'Découvre nos catégories' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Produits populaires' })).toBeVisible();

    // CTA d'inscription
    await expect(page.getByRole('link', { name: 'Commencer maintenant' })).toBeVisible();
  });

  test('navigation principale vers Services', async ({ page, isMobile }) => {
    await page.goto('/');
    if (isMobile) {
      // Sur mobile, la nav principale est remplacée par le menu hamburger
      await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
      await page.getByRole('navigation', { name: 'Navigation mobile' }).getByRole('link', { name: 'Services' }).click();
    } else {
      await page
        .getByRole('navigation', { name: 'Navigation principale' })
        .getByRole('link', { name: 'Services' })
        .first()
        .click();
    }
    await expect(page).toHaveURL(/\/services/);
    await expect(page.getByRole('heading', { level: 1, name: 'Services' })).toBeVisible();
  });

  test('aucun débordement horizontal sur petit mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(321);
  });
});
