CREATE TABLE orders (id TEXT PRIMARY KEY, total_cents INTEGER NOT NULL CHECK (total_cents >= 0), currency TEXT NOT NULL);
CREATE TRIGGER uppercase_currency AFTER INSERT ON orders
BEGIN
  UPDATE orders SET currency = upper(NEW.currency) WHERE id = NEW.id;
END;
