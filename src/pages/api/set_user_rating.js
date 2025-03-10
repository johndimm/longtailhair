import db from '@/util/db'
import { getAIRecs } from '@/util/recommendations'

export default async function handler (req, res) {
  const { user_id, tconst, rating } = req.query;

  const result = await db.setUserRating(user_id, tconst, rating)
  const count = result.count
  const titletype = 'movie'
  const aiModel = 'DeepSeek'
  const genres = ''

  if (parseInt(count) % 10 == 0) {
   await getAIRecs (user_id, titletype, genres, aiModel)
  }

  res.status(200).json(result)
}