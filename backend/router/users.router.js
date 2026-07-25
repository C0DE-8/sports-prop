const express = require("express");
const { requireAuth } = require("../middleware/auth");
const db = require("../db");

// Handles authenticated user profile routes.
const router = express.Router();
const usersTable = "users";

// Returns the current authenticated user's profile.
router.get("/me", requireAuth, async (req, res) => {
  try {
    const rows = await db.query(
      `SELECT id, name, email, role, created_at, updated_at FROM ${quoteIdentifier(usersTable)} WHERE id = ? LIMIT 1`,
      [req.user.sub]
    );

    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Safely quotes known table or column names before building SQL.
function quoteIdentifier(identifier) {
  if (!/^[A-Za-z0-9_]+$/.test(identifier)) {
    throw new Error(`Unsafe SQL identifier: ${identifier}`);
  }

  return `\`${identifier}\``;
}

module.exports = router;
