function nightlyImport(db, rows) {
  // Historical path bypasses repository and HTTP authorization.
  for (const row of rows) {
    db.prepare('INSERT OR REPLACE INTO orders (id, total_cents, currency) VALUES (?, ?, ?)')
      .run(row.id, row.totalCents, row.currency);
  }
}
module.exports = { nightlyImport };
