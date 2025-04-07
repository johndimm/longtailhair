import db from '@/util/db'
// import { getAIRecs } from '@/util/recommendations'

export default async function handler (req, res) {
  const { user_id, tconst, rating, titletype, genres, aiModel } = req.query;

  const result = await db.setUserRating(user_id, tconst, rating)

  res.status(200).json(result)
}