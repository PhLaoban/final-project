import { NextApiRequest, NextApiResponse } from 'next';
import { createReviews, getUserByValidSessionToken } from '../../util/database';

export type RegisterResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      review: {
        id: number;
        userId: number;
        locationId: string;
        review: string;
      }[];
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponseBody>,
) {
  if (req.method === 'POST') {
    console.log('req Body', req.body);
    const token = req.cookies.sessionToken;
    const user = await getUserByValidSessionToken(token);

    if (!user) {
      res.status(401).json({
        errors: [{ message: 'Something went wrong' }],
      });
      return;
    }

    const review = await createReviews(
      user.id,
      req.body.location_id,
      req.body.review,
    );

    res.status(200).json({ review });
  }
}
