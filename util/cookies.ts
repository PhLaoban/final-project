import cookie from 'cookie';

export function createSerializedSessionCookie(token: string) {
  const isProduction = process.env.NODE_ENV === 'production';
  const maxAge = 60 * 60 * 24;
  return cookie.serialize('sessionToken', token, {
    maxAge: maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
    httpOnly: true,
    secure: isProduction,
    path: '/',
    sameSite: 'lax',
  });
}
