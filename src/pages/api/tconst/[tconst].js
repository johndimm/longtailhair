import db from '@/util/db'
import { tmdb_fill } from '@/util/tmdb_fill'

export default async function handler (req, res) {
  const { tconst } = req.query
  const data = await db.get_movie_tconst(tconst)

  res.status(200).json(data)
}