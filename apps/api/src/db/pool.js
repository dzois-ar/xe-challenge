/**
 * Central pg Pool.
 * Keeps connections pooled, avoids creating new connections per request.
 */
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = { pool };
