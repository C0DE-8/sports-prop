const express = require("express");
const db = require("../db");

// Handles backend health and debug routes.
const router = express.Router();

// Checks that the DBMS Gateway is reachable with the configured project key.
router.get("/health", async (req, res) => {
  if (!hasFullApiKey(process.env.API_KEY)) {
    return res.status(400).json({
      ok: false,
      error:
        "API_KEY must be the full key shown once when generated. The dashboard project list only shows key prefixes."
    });
  }

  try {
    const status = await db.status();
    res.json({ ok: true, gateway: status });
  } catch (error) {
    res.status(503).json({ ok: false, error: error.message });
  }
});

// Returns non-secret runtime configuration for frontend diagnostics.
router.get("/debug", (req, res) => {
  const apiKey = process.env.API_KEY || "";

  res.json({
    ok: true,
    service: "sports-prop-backend",
    uptimeSeconds: Math.round(process.uptime()),
    nodeEnv: process.env.NODE_ENV || "development",
    dbms: {
      siteId: process.env.SITE_ID || null,
      dbmsUrl: process.env.DBMS_URL || "http://localhost:4000",
      timeoutMs: Number(process.env.DBMS_TIMEOUT_MS || 15000),
      hasApiKey: Boolean(apiKey),
      hasFullApiKey: hasFullApiKey(apiKey)
    },
    tables: {
      props: "sports_props",
      users: "users"
    }
  });
});

// Confirms the app has the full DBMS API key, not just the dashboard prefix.
function hasFullApiKey(value) {
  return typeof value === "string" && value.startsWith("dbms_") && value.length > 30;
}

module.exports = router;
