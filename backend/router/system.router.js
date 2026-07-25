const express = require("express");
const db = require("../db");

const router = express.Router();

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
      props: process.env.PROPS_TABLE || "sports_props"
    }
  });
});

function hasFullApiKey(value) {
  return typeof value === "string" && value.startsWith("dbms_") && value.length > 30;
}

module.exports = router;
