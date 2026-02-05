/**
 * Very small migration runner:
 * - reads ./migrations/*.sql in alphabetical order
 * - executes them against Postgres
 *
 * This is intentionally simple for a code challenge.
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("./pool");

async function migrate() {
  const dir = path.join(__dirname, "migrations");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".sql")).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), "utf8");
    console.log(`Running migration: ${file}`);
    await pool.query(sql);
  }

  console.log("Migrations completed.");
  await pool.end();
}

migrate().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});