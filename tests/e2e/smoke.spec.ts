import { expect, test } from '@playwright/test';

test('loads the GitHub Pages shell', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /sign where you were/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /star on github/i })).toHaveAttribute(
    'href',
    'https://github.com/baditaflorin/witness-attestation',
  );
  await expect(page.getByLabel(/application version and commit/i)).toContainText('v0.1.0');
});
