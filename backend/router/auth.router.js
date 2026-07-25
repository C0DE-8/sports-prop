const express = require("express");
const { hashPassword, verifyPassword } = require("../auth/password");
const { signToken } = require("../auth/token");
const db = require("../db");

const router = express.Router();
const usersTable = process.env.USERS_TABLE || "users";

router.post("/register", async (req, res) => {
  try {
    const name = cleanString(req.body.name);
    const email = cleanEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!email) return res.status(400).json({ error: "Valid email is required" });
    if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

    const existing = await db.query(`SELECT id FROM ${quoteIdentifier(usersTable)} WHERE email = ? LIMIT 1`, [email]);
    if (existing.length) return res.status(409).json({ error: "Email is already registered" });

    const passwordHash = hashPassword(password);
    await db.execute(
      `INSERT INTO ${quoteIdentifier(usersTable)} (name, email, password_hash, role, created_at, updated_at)
       VALUES (?, ?, ?, 'user', NOW(), NOW())`,
      [name, email, passwordHash]
    );

    const users = await db.query(
      `SELECT id, name, email, role, created_at FROM ${quoteIdentifier(usersTable)} WHERE email = ? LIMIT 1`,
      [email]
    );
    const user = users[0];
    const token = signToken({ sub: user.id, email: user.email, role: user.role || "user" });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = cleanEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const users = await db.query(
      `SELECT id, name, email, password_hash, role, created_at FROM ${quoteIdentifier(usersTable)} WHERE email = ? LIMIT 1`,
      [email]
    );
    const user = users[0];
    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    delete user.password_hash;
    const token = signToken({ sub: user.id, email: user.email, role: user.role || "user" });

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function cleanString(value) {
  return String(value || "").trim();
}

function cleanEmail(value) {
  const email = cleanString(value).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function quoteIdentifier(identifier) {
  if (!/^[A-Za-z0-9_]+$/.test(identifier)) {
    throw new Error(`Unsafe SQL identifier: ${identifier}`);
  }

  return `\`${identifier}\``;
}

module.exports = router;
