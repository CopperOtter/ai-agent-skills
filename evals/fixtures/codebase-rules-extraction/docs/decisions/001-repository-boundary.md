# ADR-001: Route application writes through repositories

Status: Accepted
Date: 2025-01-10

Order creation must use the selected repository adapter so idempotency is kept at the persistence boundary. Application jobs must not bypass that boundary. Schema migrations remain database-owned. The nightly import predates this decision; its long-term treatment has not been decided.
