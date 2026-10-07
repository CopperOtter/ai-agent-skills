const test = require('node:test');
const assert = require('node:assert/strict');
const { bootstrap } = require('../src/bootstrap');
const notifications = require('../src/notifications');
const { reconcile, wasNotified } = require('../src/orders/reconcile');

test('writer creates an order; currency is not restricted to EUR', () => {
  const api = bootstrap({ STORE: 'memory' });
  const row = api.createOrder({ actor: { role: 'writer' }, body: { id: 'one', totalCents: 100, currency: 'gbp' } });
  assert.equal(row.currency, 'gbp');
  assert.equal(row.totalCents, 100);
});

test('duplicate ID returns existing order without another notification', () => {
  const api = bootstrap({ STORE: 'memory' });
  const request = { actor: { role: 'writer' }, body: { id: 'two', totalCents: 150, currency: 'EUR' } };
  const before = notifications.delivered.length;
  assert.equal(api.createOrder(request).totalCents, 150);
  assert.equal(api.createOrder({ ...request, body: { ...request.body, totalCents: 999 } }).totalCents, 150);
  assert.equal(notifications.delivered.length - before, 1);
});

test('HTTP rejects non-writers and service rejects invalid totals', () => {
  const api = bootstrap({ STORE: 'memory' });
  assert.throws(() => api.createOrder({ body: {} }), /forbidden/);
  assert.throws(() => api.createOrder({ actor: { role: 'writer' }, body: { id: 'three', totalCents: -1, currency: 'EUR' } }), /invalid total/);
});

test('reconciliation and notifications share state across their dependency cycle', () => {
  const before = notifications.delivered.length;
  assert.equal(reconcile({ id: 'four' }), true);
  assert.equal(wasNotified('four'), true);
  assert.equal(reconcile({ id: 'four' }), true);
  assert.equal(notifications.delivered.length - before, 1);
});
