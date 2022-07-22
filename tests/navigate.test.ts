import { expect, test } from '@playwright/test';

const baseUrl = 'http://localhost:3000';
test('test maps', async ({ page }) => {
  await page.goto(baseUrl);
  await page.locator('text=Register').click();
  await expect(page).toHaveURL(`${baseUrl}/register`);

  await page.locator('data-test-id=username').fill('Karl');
  await page.locator('data-test-id=password').fill('123');
  await page.locator('data-test-id=button-register').click();
  await page.goto(`${baseUrl}/login`);
  // Fill in the form
  await page.locator('data-test-id=input-username').fill('Karl');
  await page.locator('data-test-id=input-password').fill('123');
  // Click the login button
  const loginButton = page.locator('data-test-id=button-login');
  await loginButton.click();
  await expect(page).toHaveURL(baseUrl);

  // await expect(page).toHaveURL(`${baseUrl}/users/private-profile`);

  // Go to the Map page
  await page.goto(`${baseUrl}/map`);
  // Make sure to have the right title

  await page.locator('data-test-id=selection-bar').selectOption('2');
  await page
    .locator(
      'text=Alliiertenstraße 5 Private or Public: Privat mit KennzeichenShow more informatio >> [data-test-id="favorites"]',
    )
    .click();

  await page.goto(`${baseUrl}/users/private-profile`);
  const title = page.locator('h1');
  await expect(title).toHaveText('Hello Karl');
  const isInList = page.locator('.streets');
  await expect(isInList).toContainText('Alliiertenstraße');
});
