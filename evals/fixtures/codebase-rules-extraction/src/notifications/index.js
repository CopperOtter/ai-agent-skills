const delivered = [];

function notify(id) {
  delivered.push({ type: 'order.created', id });
  require('../orders/reconcile').markNotified(id);
}
module.exports = { notify, delivered };
