function sqlRepository(db) {
  if (!db) throw new Error('SQL connection required');
  return {
    save(order) {
      const insert = db.prepare('INSERT OR IGNORE INTO orders (id, total_cents, currency) VALUES (?, ?, ?)');
      const result = insert.run(order.id, order.totalCents, order.currency);
      const row = db.prepare('SELECT id, total_cents, currency FROM orders WHERE id = ?').get(order.id);
      return { order: { id: row.id, totalCents: row.total_cents, currency: row.currency }, created: result.changes === 1 };
    }
  };
}
module.exports = { sqlRepository };
