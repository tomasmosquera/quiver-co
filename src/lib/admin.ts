export const ADMIN_EMAILS = [
  "tmosquera93@gmail.com",
  "tomasmosquera@hotmail.com",
  // Agrega aquí más emails de admin:
  // "otro@gmail.com",
];

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}
