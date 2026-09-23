import { expect, test } from '@playwright/test';

test.describe('Authentification', () => {
  test('affiche le formulaire de connexion', async ({ page }) => {
    await page.goto('/connexion');
    await expect(page.getByRole('heading', { level: 1, name: 'Connexion' })).toBeVisible();
    await expect(page.getByLabel('Adresse e-mail')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Mot de passe' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
  });

  test('affiche le formulaire d’inscription', async ({ page }) => {
    await page.goto('/inscription');
    await expect(page.getByRole('heading', { level: 1, name: 'Créer un compte' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Créer mon compte' })).toBeVisible();
  });

  test('valide les champs de connexion côté client', async ({ page }) => {
    await page.goto('/connexion');
    await page.getByLabel('Adresse e-mail').fill('pas-un-email');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page.getByRole('alert').first()).toContainText(/e-mail/i);
  });

  test('protège les routes privées (redirection vers /connexion)', async ({ page, isMobile }) => {
    await page.goto('/profil');
    await expect(page).toHaveURL(/\/connexion/);

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/connexion/);

    // Un utilisateur non admin ne peut pas accéder à /admin par l'URL
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/connexion|\/$/);
    void isMobile;
  });
});
