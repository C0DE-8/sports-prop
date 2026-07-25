const crypto = require("crypto");

const defaultTtlSeconds = 60 * 60 * 24 * 7;

// Signs a compact HMAC token for authenticated API requests.
function signToken(payload, options = {}) {
  const secret = getSecret();
  const ttlSeconds = Number(options.ttlSeconds || defaultTtlSeconds);
  const body = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds
  };
  const encoded = base64Url(JSON.stringify(body));
  const signature = sign(encoded, secret);

  return `${encoded}.${signature}`;
}

// Validates an auth token signature and expiration time.
function verifyToken(token) {
  const secret = getSecret();
  const [encoded, signature] = String(token || "").split(".");
  if (!encoded || !signature) throw new Error("Invalid auth token");

  const expected = sign(encoded, secret);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new Error("Invalid auth token");
  }

  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Auth token expired");
  }

  return payload;
}

// Reads and validates the JWT_SECRET used to sign app tokens.
function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 24) {
    throw new Error("JWT_SECRET must be at least 24 characters");
  }

  return secret;
}

// Creates the HMAC signature for a token body.
function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

// Encodes a value for URL-safe token transport.
function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

module.exports = {
  signToken,
  verifyToken
};
