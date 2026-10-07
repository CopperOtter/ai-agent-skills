# Ledger Desk

Small order-processing service. Run local verification with `npm test` (Node.js 20+; no packages to install). There is no build step.

Historical overview: all orders use EUR, all writes go through the repository, and the memory store behaves exactly like SQL.

The API bootstrap and nightly import are separate entry points. SQL production verification requires a separately provisioned SQLite connection passed to bootstrap; no database connection is supplied in this fixture. Do not run deployment or migration commands for documentation work.
