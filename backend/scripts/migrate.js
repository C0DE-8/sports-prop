require("dotenv").config();

const fs = require("fs");
const path = require("path");
const db = require("../db");

const migrationsDir = path.join(__dirname, "..", "migrations");

async function main() {
  await ensureMigrationsTable();

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const applied = await isApplied(file);
    if (applied) {
      console.log(`skip ${file}`);
      continue;
    }

    console.log(`apply ${file}`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    const statements = splitSql(sql);

    for (const statement of statements) {
      await db.execute(statement);
    }

    await db.execute("INSERT INTO schema_migrations (filename) VALUES (?)", [file]);
    console.log(`done ${file}`);
  }

  console.log("migrations complete");
}

async function ensureMigrationsTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      filename VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY schema_migrations_filename_unique (filename)
    )
  `);
}

async function isApplied(filename) {
  const rows = await db.query("SELECT id FROM schema_migrations WHERE filename = ? LIMIT 1", [filename]);
  return rows.length > 0;
}

function splitSql(sql) {
  const withoutComments = sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  return withoutComments
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
