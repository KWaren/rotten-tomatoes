import bcrypt from "bcrypt";
// import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, hashed) {
  return await bcrypt.compare(password, hashed);
}

export function generateVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function signJwt(payload, secret, expiresIn = "7d") {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJwt(token, secret) {
  return jwt.verify(token, secret);
}
