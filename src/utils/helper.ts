import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export async function generateHashedPassword(password: string) {
  const salt = await bcrypt.genSalt(13);
  return bcrypt.hash(password, salt);
}

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
