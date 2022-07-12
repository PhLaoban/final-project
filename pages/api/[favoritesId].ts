import { NextApiRequest, NextApiResponse } from 'next';
import {
  getUserByValidSessionToken,
  removeFromFavorites,
} from '../../util/database';
import { RegisterResponseBody } from './favorites';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponseBody>,
) {
  if (req.method === 'DELETE') {
    // 1. Get the cookie from the request
    const token = req.cookies.sessionToken;

    if (!token) {
      res
        .status(400)
        .json({ errors: [{ message: 'No session token passed' }] });
      return;
    }

    // 2. Get the user from the token
    const user = await getUserByValidSessionToken(token);

    if (!user) {
      res
        .status(400)
        .json({ errors: [{ message: 'Session token not valid' }] });
      return;
    }
    console.log(req.query);
    if (typeof req.query.favoritesId !== 'string') {
      res
        .status(400)
        .json({ errors: [{ message: 'Username or password not provided!' }] });
      return;
    }
    await removeFromFavorites(req.query.favoritesId);

    return;
  }
}
