import db from '@/util/db'
import { tmdb_fill } from '@/util/tmdb_fill'

export default async function handler (req, res) {
  const {
    query: { tconst, user_id }
  } = req
  const data = await db.get_movie(tconst, user_id)

  await tmdb_fill(data)

  res.status(200).json(data)
}