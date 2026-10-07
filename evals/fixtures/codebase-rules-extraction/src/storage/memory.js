function memoryRepository() {
  const rows = new Map();
  return {
    save(order) {
      if (rows.has(order.id)) return { order: rows.get(order.id), created: false };
      const stored = { ...order };
      rows.set(order.id, stored);
      return { order: stored, created: true };
    }
  };
}
module.exports = { memoryRepository };
