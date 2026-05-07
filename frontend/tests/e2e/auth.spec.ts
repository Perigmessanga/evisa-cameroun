import { test, expect } from '@playwright/test';

test.describe('Authentification et Navigation', () => {
  
  test('un utilisateur peut se connecter et accéder au dashboard', async ({ page }) => {
    // 1. Aller sur la page d'accueil
    await page.goto('/');
    
    // 2. Cliquer sur le bouton de connexion (en haut à droite)
    // On suppose qu'il y a un lien "Se connecter"
    const loginLink = page.getByRole('link', { name: /connexion/i }).first();
    await loginLink.click();
    
    // 3. Vérifier qu'on est sur la page de login
    await expect(page).toHaveURL(/\/auth\/login/);
    
    // 4. Remplir les identifiants
    // On utilise un compte de test existant ou on en crée un dans le backend
    await page.getByPlaceholder('votre@email.com').fill('test@example.com');
    await page.getByPlaceholder('Votre mot de passe').fill('password123');
    
    // 5. Cliquer sur "Se connecter"
    await page.getByRole('button', { name: /se connecter/i }).click();
    
    // 6. Vérifier la redirection vers le dashboard
    await expect(page).toHaveURL(/\/applicant\/dashboard/);
    
    // 7. Vérifier un élément du dashboard (le titre de la page)
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('affiche une erreur si les identifiants sont incorrects', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByPlaceholder('votre@email.com').fill('mauvais@email.com');
    await page.getByPlaceholder('Votre mot de passe').fill('mauvaispass');
    
    await page.getByRole('button', { name: /se connecter/i }).click();
    
    // Vérifier le message d'erreur
    await expect(page.getByText(/email ou mot de passe incorrect/i)).toBeVisible();
  });
});
