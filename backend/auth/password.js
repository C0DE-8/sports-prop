const crypto = require("crypto");

const iterations = 120000;
const keyLength = 64;
const digest = "sha512";

// Hashes a plaintext password with PBKDF2 before storage.
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest).toString("hex");

  return `pbkdf2$${iterations}$${salt}$${hash}`;
}

// Compares a plaintext password against a stored PBKDF2 hash.
function verifyPassword(password, storedHash) {
  const [scheme, iterationValue, salt, hash] = String(storedHash || "").split("$");
  if (scheme !== "pbkdf2" || !iterationValue || !salt || !hash) return false;

  const testHash = crypto
    .pbkdf2Sync(password, salt, Number(iterationValue), Buffer.from(hash, "hex").length, digest)
    .toString("hex");

  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(testHash, "hex"));
}

module.exports = {
  hashPassword,
  verifyPassword
};
