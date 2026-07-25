const express = require("express");

const router = express.Router();

router.get("/matches", async (req, res) => {
  try {
    const provider = process.env.SPORTS_DATA_PROVIDER || "sportmonks";
    if (provider !== "sportmonks") {
      return res.status(400).json({ error: `Unsupported sports data provider: ${provider}` });
    }

    const apiToken = process.env.SPORTMONKS_API_TOKEN;
    if (!apiToken || apiToken.startsWith("replace-")) {
      return res.status(501).json({
        error: "SPORTMONKS_API_TOKEN is required to load real match listings",
        provider: "sportmonks",
        docs: "https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/fixtures"
      });
    }

    const date = normalizeDate(req.query.date);
    const include = cleanInclude(req.query.include) || "participants;league;state;scores";
    const baseUrl = normalizeUrl(process.env.SPORTMONKS_BASE_URL || "https://api.sportmonks.com/v3/football");
    const url = new URL(`${baseUrl}/fixtures/date/${date}`);
    url.searchParams.set("api_token", apiToken);
    url.searchParams.set("include", include);

    const response = await fetch(url, { headers: { Accept: "application/json" } });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json({
        error: payload.message || payload.error || "Sports data request failed",
        provider: "sportmonks"
      });
    }

    res.json({
      provider: "sportmonks",
      date,
      data: payload.data || [],
      pagination: payload.pagination || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function normalizeDate(value) {
  const candidate = String(value || new Date().toISOString().slice(0, 10));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate)) {
    throw new Error("date must use YYYY-MM-DD format");
  }

  return candidate;
}

function cleanInclude(value) {
  const include = String(value || "").trim();
  if (!include) return "";
  if (!/^[A-Za-z0-9_;]+$/.test(include)) {
    throw new Error("include contains unsupported characters");
  }

  return include;
}

function normalizeUrl(url) {
  return String(url || "").replace(/\/$/, "");
}

module.exports = router;
