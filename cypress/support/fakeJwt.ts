// Builds a JWT that decodeJwt() (src/app/core/utils/jwt.util.ts) can parse: only the
// payload segment matters, and it must carry a "sub" claim since that's where UserService
// reads the username from. Header and signature are arbitrary since nothing validates them.
export function fakeJwt(username: string): string {
  const payload = btoa(JSON.stringify({ sub: username }));
  return `header.${payload}.signature`;
}
