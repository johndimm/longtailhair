import db from '@/util/db'

export default async function handler (req, res) {
  const { user_id, tconst, rating } = req.query;

  const response = await db.setUserRating(user_id, tconst, rating)
  res.status(200).json(response)
}