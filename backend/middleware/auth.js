const { verifyToken } = require("../auth/token");

// Requires a Bearer token and attaches its payload to req.user.
function requireAuth(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ error: "Missing auth token" });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

module.exports = {
  requireAuth
};
