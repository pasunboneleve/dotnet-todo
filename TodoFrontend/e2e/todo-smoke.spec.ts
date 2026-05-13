import { expect, test } from '@playwright/test';

test('adds and deletes a todo through the real app', async ({ page, request }) => {
  const todos = await request.get('/api/todos');
  expect(todos.ok()).toBe(true);
  for (const todo of await todos.json() as Array<{ id: number }>) {
    const deleted = await request.delete(`/api/todos/${todo.id}`);
    expect(deleted.ok()).toBe(true);
  }

  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'TODO List' })).toBeVisible();
  await expect(page.getByText('No todos yet.')).toBeVisible();

  const title = 'Smoke test todo';
  const input = page.getByLabel('New item');
  await input.fill(title);
  await input.press('Enter');

  await expect(page.getByText(title)).toBeVisible();
  await page.getByRole('button', { name: `Delete ${title}` }).click();

  await expect(page.getByText(title)).toBeHidden();
  await expect(page.getByText('No todos yet.')).toBeVisible();
});
