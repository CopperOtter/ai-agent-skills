const { createOrderService } = require('./orders/service');
const { memoryRepository } = require('./storage/memory');
const { sqlRepository } = require('./storage/sql');
const { createHandler } = require('./http/create-order');

function bootstrap(env, db) {
  const repo = env.STORE === 'sql' ? sqlRepository(db) : memoryRepository();
  const service = createOrderService(repo);
  return { createOrder: createHandler(service) };
}
module.exports = { bootstrap };
