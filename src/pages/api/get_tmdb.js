import { getTheMovieDatabase } from "@/util/tmdb_fill"

export default async function handler (req, res) {
  const { tconst, titletype } = req.query
  const r = {}
  r.titletype = titletype

  const response = await getTheMovieDatabase(tconst, r)
  res.status(200).json( response )
}