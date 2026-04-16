import { expect, it, vi } from 'vitest';
import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';

const baseURL = 'http://localhost:3000';

const handleRequest = vi.fn(() => {
  return HttpResponse.json([]);
});

const worker = setupWorker(http.get(`${baseURL}/users`, handleRequest));

it('only intercepts requests while the worker is active', async () => {
  expect(handleRequest).toHaveBeenCalledTimes(0);

  await expect(async () => {
    await fetch(`${baseURL}/users`);
  }).rejects.toThrow(TypeError);

  await worker.start();

  let response = await fetch(`${baseURL}/users`);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual([]);

  expect(handleRequest).toHaveBeenCalledTimes(1);

  worker.stop();

  await expect(async () => {
    await fetch(`${baseURL}/users`);
  }).rejects.toThrow(TypeError);

  expect(handleRequest).toHaveBeenCalledTimes(1);

  await worker.start();

  response = await fetch(`${baseURL}/users`);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual([]);

  expect(handleRequest).toHaveBeenCalledTimes(2);

  worker.stop();

  await expect(async () => {
    await fetch(`${baseURL}/users`);
  }).rejects.toThrow(TypeError);

  expect(handleRequest).toHaveBeenCalledTimes(2);

  await worker.start();

  response = await fetch(`${baseURL}/users`);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual([]);

  expect(handleRequest).toHaveBeenCalledTimes(3);
});
