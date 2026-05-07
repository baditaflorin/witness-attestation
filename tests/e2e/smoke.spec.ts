import { expect, test } from '@playwright/test';

test('loads the GitHub Pages shell', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /presence attestation/i }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /star on github/i })).toHaveAttribute(
    'href',
    'https://github.com/baditaflorin/witness-attestation',
  );
  await expect(page.getByRole('link', { name: /support/i })).toHaveAttribute(
    'href',
    'https://www.paypal.com/paypalme/florinbadita',
  );
  await expect(page.getByLabel(/application version and commit/i)).toContainText(
    'v0.1.0',
  );

  await expect(page.getByRole('button', { name: /generate key/i })).toBeEnabled();
  await page.getByRole('button', { name: /demo fix/i }).click();
  await page.getByRole('button', { name: /sign event/i }).click();

  await expect(page.getByRole('status')).toContainText('Attestation signed', {
    timeout: 15_000,
  });
  await expect(page.getByText(/#0/)).toBeVisible();
  await expect(page.getByRole('button', { name: /export latest bundle/i })).toBeEnabled();
});
