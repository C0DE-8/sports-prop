const express = require("express");
const db = require("../db");

// Handles sports prop board and lookup routes.
const router = express.Router();
const propsTable = "sports_props";

// Lists props with optional sport, league, player, market, and game filters.
router.get("/props", async (req, res) => {
  try {
    const { sport, league, player, market, gameId, limit } = req.query;
    const filters = [];
    const params = [];

    addFilter(filters, params, "sport", sport);
    addFilter(filters, params, "league", league);
    addFilter(filters, params, "player_name", player);
    addFilter(filters, params, "market", market);
    addFilter(filters, params, "game_id", gameId);

    const safeLimit = clampLimit(limit);
    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const rows = await db.query(
      `SELECT * FROM ${quoteIdentifier(propsTable)} ${where} ORDER BY game_time ASC, id DESC LIMIT ?`,
      [...params, safeLimit]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Returns one prop by database id.
router.get("/props/:id", async (req, res) => {
  try {
    const rows = await db.query(`SELECT * FROM ${quoteIdentifier(propsTable)} WHERE id = ?`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Prop not found" });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lists unique leagues found in the props table.
router.get("/leagues", async (req, res) => {
  try {
    const rows = await db.query(
      `SELECT DISTINCT league FROM ${quoteIdentifier(propsTable)} WHERE league IS NOT NULL ORDER BY league ASC`
    );

    res.json(rows.map((row) => row.league));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Adds an equality filter only when the query value is present.
function addFilter(filters, params, column, value) {
  if (value === undefined || value === "") return;

  filters.push(`${quoteIdentifier(column)} = ?`);
  params.push(value);
}

// Keeps API list limits inside a predictable range.
function clampLimit(value) {
  const parsed = Number(value || 50);
  if (!Number.isFinite(parsed)) return 50;

  return Math.min(Math.max(Math.trunc(parsed), 1), 200);
}

// Safely quotes known table or column names before building SQL.
function quoteIdentifier(identifier) {
  if (!/^[A-Za-z0-9_]+$/.test(identifier)) {
    throw new Error(`Unsafe SQL identifier: ${identifier}`);
  }

  return `\`${identifier}\``;
}

module.exports = router;
