import { expect, it } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const baseURL = 'http://localhost:3000';

const server = setupServer(
  http.get(`${baseURL}/users`, () => {
    return HttpResponse.json([]);
  }),
);

it('only intercepts requests while the server is active', async () => {
  // Requests before the server is started should fail.
  await expect(async () => {
    await fetch(`${baseURL}/users`);
  }).rejects.toThrow(TypeError);

  server.listen();

  // Requests after the server is started should succeed.
  let response = await fetch(`${baseURL}/users`);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual([]);

  server.close();

  // Now that the server is stopped, requests should fail again.
  await expect(async () => {
    await fetch(`${baseURL}/users`);
  }).rejects.toThrow(TypeError);

  server.listen();

  // The server is started again, so requests should succeed again.
  response = await fetch(`${baseURL}/users`);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual([]);
});
