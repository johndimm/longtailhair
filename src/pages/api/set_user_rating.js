import db from '@/util/db'
import { getAIRecs } from '@/util/recommendations'

export default async function handler (req, res) {
  const { user_id, tconst, rating, titletype, genres, aiModel } = req.query;

  const result = await db.setUserRating(user_id, tconst, rating)
  const count = result.count

  if (parseInt(count) % 10 == 0) {
    getAIRecs (user_id, titletype, genres, aiModel)
  }

  res.status(200).json(result)
}