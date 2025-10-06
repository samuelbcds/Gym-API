import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import jsonwebtoken, { Algorithm, SignOptions, VerifyOptions } from "jsonwebtoken";

interface PasswordHash {
  salt: string;
  hash: string;
}

interface JwtSubject {
  id: string;
  role: string;
}

interface SignedJwtPayload {
  sub: JwtSubject;
  iat: number;
  [key: string]: unknown;
}

const KEYS_DIR = path.resolve(__dirname, "..", "..", "keys");

const PRIV_KEY_PATH = path.join(KEYS_DIR, "id_rsa_priv.pem");
const PUB_KEY_PATH = path.join(KEYS_DIR, "id_rsa_pub.pem");

const PRIV_KEY = fs.readFileSync(PRIV_KEY_PATH, "utf-8");
const PUB_KEY = fs.readFileSync(PUB_KEY_PATH, "utf-8");

const SALT_BYTE_LENGTH = 32;
const PBKDF2_ITERATIONS = 10000;
const PBKDF2_KEY_LENGTH = 64;
const PBKDF2_DIGEST = "sha512";

const TOKEN_EXPIRATION = "7d";
const TOKEN_ALGORITHM: Algorithm = "RS256";

const SIGN_OPTIONS: SignOptions = {
  expiresIn: TOKEN_EXPIRATION,
  algorithm: TOKEN_ALGORITHM,
};

const VERIFY_OPTIONS: VerifyOptions = {
  algorithms: [TOKEN_ALGORITHM],
};

const isSignedJwtPayload = (payload: unknown): payload is SignedJwtPayload => {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const subject = (payload as SignedJwtPayload).sub;

  return (
    typeof subject === "object" &&
    subject !== null &&
    typeof subject.id === "string" &&
    typeof subject.role === "string"
  );
};

/**
 * Generates a PBKDF2 hash and salt for the provided password.
 */
const generatePassword = (password: string): PasswordHash => {
  const salt = crypto.randomBytes(SALT_BYTE_LENGTH).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEY_LENGTH, PBKDF2_DIGEST)
    .toString("hex");

  return { salt, hash };
};

/**
 * Validates a candidate password against a stored PBKDF2 hash.
 */
const checkPassword = (password: string, hash: string, salt: string): boolean => {
  const hashFromRequest = crypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEY_LENGTH, PBKDF2_DIGEST)
    .toString("hex");

  return hashFromRequest === hash;
};

/**
 * Creates a signed JWT using the application private key.
 */
const generateJWT = (userId: string, userRole: string): string => {
  const payload: SignedJwtPayload = {
    sub: { id: userId, role: userRole },
    iat: Math.floor(Date.now() / 1000),
  };

  const encodedToken = jsonwebtoken.sign(payload, PRIV_KEY, SIGN_OPTIONS);

  return encodedToken;
};

/**
 * Verifies and decodes a JWT using the public key.
 */
const decodeJWT = (token: string): SignedJwtPayload => {
  try {
    const decodedPayload = jsonwebtoken.verify(token, PUB_KEY, VERIFY_OPTIONS);

    if (!isSignedJwtPayload(decodedPayload)) {
      throw new Error("Invalid token payload");
    }

    return decodedPayload;
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid token payload") {
      throw error;
    }

    throw new Error("Invalid token");
  }
};

export default {
  generatePassword,
  checkPassword,
  generateJWT,
  decodeJWT,
};
