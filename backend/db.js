require("dotenv").config();

const { connectProject } = require("./diamond-sql");

let db;

function getDb() {
  if (!db) {
    db = connectProject(process.env.SITE_ID, {
      apiKey: process.env.API_KEY,
      dbmsUrl: process.env.DBMS_URL,
      timeoutMs: process.env.DBMS_TIMEOUT_MS
    });
  }

  return db;
}

module.exports = {
  getDb,
  query(...args) {
    return getDb().query(...args);
  },
  execute(...args) {
    return getDb().execute(...args);
  },
  status(...args) {
    return getDb().status(...args);
  }
};
