import crypto from 'crypto';

/**
 * Hash a password using PBKDF2 with salt to ensure zero plaintext password storage.
 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const passwordSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, passwordSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: passwordSalt };
}

/**
 * Verify a plain password against stored salt and hash.
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const calculatedHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return calculatedHash === hash;
}
