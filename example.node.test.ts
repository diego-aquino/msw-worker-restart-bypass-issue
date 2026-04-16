import { expect, it, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const baseURL = 'http://localhost:3000';

const handleRequest = vi.fn(() => {
  return HttpResponse.json([]);
});

const server = setupServer(http.get(`${baseURL}/users`, handleRequest));

it('only intercepts requests while the server is active', async () => {
  expect(handleRequest).toHaveBeenCalledTimes(0);

  await expect(async () => {
    await fetch(`${baseURL}/users`);
  }).rejects.toThrow(TypeError);

  server.listen();

  let response = await fetch(`${baseURL}/users`);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual([]);

  expect(handleRequest).toHaveBeenCalledTimes(1);

  server.close();

  await expect(async () => {
    await fetch(`${baseURL}/users`);
  }).rejects.toThrow(TypeError);

  expect(handleRequest).toHaveBeenCalledTimes(1);

  server.listen();

  response = await fetch(`${baseURL}/users`);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual([]);

  expect(handleRequest).toHaveBeenCalledTimes(2);

  server.close();

  await expect(async () => {
    await fetch(`${baseURL}/users`);
  }).rejects.toThrow(TypeError);

  expect(handleRequest).toHaveBeenCalledTimes(2);

  server.listen();

  response = await fetch(`${baseURL}/users`);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual([]);

  expect(handleRequest).toHaveBeenCalledTimes(3);
});
