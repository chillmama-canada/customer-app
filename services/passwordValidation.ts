// Mirrors mobilePasswordSchema in the webapp's src/lib/validators/index.ts —
// keep these in sync. Client-side check is just for instant feedback; the
// backend is the actual source of truth.
export const PASSWORD_SPECIAL_CHARS = '!@#$%^&*()-_=+';
export const PASSWORD_HINT = `8-16 characters, with an uppercase letter, a lowercase letter, a number, and a special character (${PASSWORD_SPECIAL_CHARS})`;

const ALLOWED_CHARS_PATTERN = /^[A-Za-z0-9!@#$%^&*()\-_=+]+$/;
const SPECIAL_CHAR_PATTERN = /[!@#$%^&*()\-_=+]/;

export function validatePassword(password: string): string | null {
  if (password.length < 8 || password.length > 16) {
    return 'Password must be 8-16 characters';
  }
  if (!ALLOWED_CHARS_PATTERN.test(password)) {
    return `Password can only contain letters, numbers, and ${PASSWORD_SPECIAL_CHARS}`;
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must include an uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must include a lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must include a number';
  }
  if (!SPECIAL_CHAR_PATTERN.test(password)) {
    return `Password must include a special character (${PASSWORD_SPECIAL_CHARS})`;
  }
  return null;
}
