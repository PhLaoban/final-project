import { NextApiRequest, NextApiResponse } from 'next';
import {
  createFavorite,
  getUserByValidSessionToken,
} from '../../util/database';

export type RegisterResponseBody = {
  errors: {
    message: string;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponseBody>,
) {
  if (req.method === 'POST') {
    console.log('req Body', req.body);
    const token = req.cookies.sessionToken;

    if (!token) {
      return res.status(400).json({ errors: [{ message: 'Error' }] });
    }

    const user = await getUserByValidSessionToken(token);
    console.log('LOG FROM USER', user);

    if (!user) {
      return res.status(401).json({
        errors: [{ message: 'Username or password does not match!' }],
      });
    }

    const newFavorites = await createFavorite(
      user.id,
      req.body.location_id,
      req.body.latitude,
      req.body.longitude,
      req.body.streetname,
      req.body.number,
    );
    console.log('newFavorites', newFavorites);
  }
}
