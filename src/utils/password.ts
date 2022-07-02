import { hash, compare } from 'bcrypt';

export function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}
export function comparePasswords(
  password: string,
  hashed: string,
): Promise<boolean> {
  return compare(password, hashed);
}
