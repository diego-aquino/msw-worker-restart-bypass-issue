import { expect, it } from 'vitest';
import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';

const baseURL = 'http://localhost:3000';

const worker = setupWorker(
  http.get(`${baseURL}/users`, () => {
    return HttpResponse.json([]);
  }),
);

it('only intercepts requests while the worker is active', async () => {
  // Requests before the worker is started should fail.
  await expect(async () => {
    await fetch(`${baseURL}/users`);
  }).rejects.toThrow(TypeError);

  await worker.start();

  // Requests after the worker is started should succeed.
  let response = await fetch(`${baseURL}/users`);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual([]);

  worker.stop();

  // Now that the worker is stopped, requests should fail again.
  await expect(async () => {
    await fetch(`${baseURL}/users`);
  }).rejects.toThrow(TypeError);

  await worker.start();

  // The worker is started again, so requests should succeed again.
  response = await fetch(`${baseURL}/users`);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual([]);
});
