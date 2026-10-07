const notifications = require('../notifications');
const notified = new Set();

function markNotified(id) { notified.add(id); }
function reconcile(order) {
  if (!notified.has(order.id)) notifications.notify(order.id);
  return notified.has(order.id);
}
function wasNotified(id) { return notified.has(id); }
module.exports = { markNotified, reconcile, wasNotified };
