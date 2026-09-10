export function decodeJwt(token: string): unknown {
  const payload = token.split('.')[1];
  const base64 = payload.replaceAll('-', '+').replaceAll('_', '/');
  return JSON.parse(atob(base64));
}
