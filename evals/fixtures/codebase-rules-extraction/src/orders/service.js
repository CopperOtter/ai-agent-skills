const notifications = require('../notifications');

function createOrderService(repo) {
  return {
    create(order) {
      if (!Number.isInteger(order.totalCents) || order.totalCents < 0) throw new Error('invalid total');
      if (!order.id || !order.currency) throw new Error('missing fields');
      const result = repo.save(order);
      if (result.created) notifications.notify(result.order.id);
      return result.order;
    }
  };
}
module.exports = { createOrderService };
