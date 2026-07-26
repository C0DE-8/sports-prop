const express = require("express");

// Handles real sports match listing routes through a server-side provider key.
const router = express.Router();

// Proxies Sportmonks fixture listings so provider tokens stay off the frontend.
router.get("/matches", async (req, res) => {
  try {
    const payload = await fetchSportmonksMatches(req.query);
    res.json(payload);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// Proxies a specific Sportmonks round with odds and fixture context.
router.get("/matches/round/:roundId", async (req, res) => {
  try {
    const payload = await fetchSportmonksMatches({ ...req.query, mode: "round", roundId: req.params.roundId });
    res.json(payload);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// Builds and executes either the preferred round query or the older date query.
async function fetchSportmonksMatches(query) {
  const provider = process.env.SPORTS_DATA_PROVIDER || "sportmonks";
  if (provider !== "sportmonks") {
    throw new Error(`Unsupported sports data provider: ${provider}`);
  }

  const apiToken = process.env.SPORTMONKS_API_TOKEN;
  if (!apiToken || apiToken.startsWith("replace-")) {
    const error = new Error("SPORTMONKS_API_TOKEN is required to load real match listings");
    error.statusCode = 501;
    throw error;
  }

  const baseUrl = normalizeUrl(process.env.SPORTMONKS_BASE_URL || "https://api.sportmonks.com/v3/football");
  const mode = cleanMode(query.mode);
  const url = mode === "date" ? buildDateUrl(baseUrl, query) : buildRoundUrl(baseUrl, query);
  url.searchParams.set("api_token", apiToken);

  const response = await fetch(url, { headers: { Accept: "application/json" } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || payload.error || "Sports data request failed");
    error.statusCode = response.status;
    throw error;
  }

  return {
    provider: "sportmonks",
    mode,
    data: payload.data || null,
    pagination: payload.pagination || null
  };
}

// Builds the preferred round endpoint with odds market/bookmaker filters.
function buildRoundUrl(baseUrl, query) {
  const roundId = cleanNumericId(query.roundId || process.env.SPORTMONKS_ROUND_ID || "372154");
  const include =
    cleanInclude(query.include) || "fixtures.odds.market;fixtures.odds.bookmaker;fixtures.participants;league.country";
  const filters = cleanFilters(query.filters) || "markets:1;bookmakers:2";
  const url = new URL(`${baseUrl}/rounds/${roundId}`);
  url.searchParams.set("include", include);
  url.searchParams.set("filters", filters);

  return url;
}

// Builds the legacy date endpoint for browsing fixtures by calendar date.
function buildDateUrl(baseUrl, query) {
  const date = normalizeDate(query.date);
  const include = cleanInclude(query.include) || "participants;league;state;scores";
  const url = new URL(`${baseUrl}/fixtures/date/${date}`);
  url.searchParams.set("include", include);

  return url;
}

// Restricts match fetch modes to the two supported provider queries.
function cleanMode(value) {
  return value === "date" ? "date" : "round";
}

// Defaults and validates fixture dates in YYYY-MM-DD format.
function normalizeDate(value) {
  const candidate = String(value || new Date().toISOString().slice(0, 10));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate)) {
    throw new Error("date must use YYYY-MM-DD format");
  }

  return candidate;
}

// Restricts provider include strings to the simple Sportmonks include syntax.
function cleanInclude(value) {
  const include = String(value || "").trim();
  if (!include) return "";
  if (!/^[A-Za-z0-9_.;]+$/.test(include)) {
    throw new Error("include contains unsupported characters");
  }

  return include;
}

// Restricts provider filters to the simple Sportmonks filter syntax.
function cleanFilters(value) {
  const filters = String(value || "").trim();
  if (!filters) return "";
  if (!/^[A-Za-z0-9_:;,-]+$/.test(filters)) {
    throw new Error("filters contains unsupported characters");
  }

  return filters;
}

// Allows only numeric Sportmonks ids in provider paths.
function cleanNumericId(value) {
  const id = String(value || "").trim();
  if (!/^\d+$/.test(id)) {
    throw new Error("roundId must be numeric");
  }

  return id;
}

// Removes a trailing slash so provider paths join cleanly.
function normalizeUrl(url) {
  return String(url || "").replace(/\/$/, "");
}

module.exports = router;
