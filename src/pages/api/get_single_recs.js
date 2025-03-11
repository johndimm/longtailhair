import { getMovieAIRecs } from '@/util/recommendations'

export default async function handler(req, res) {
  const {
    query: { user_id, tconst, aiModel }
  } = req

  const recs = await getMovieAIRecs(user_id, tconst, aiModel)

  res.status(200).json(recs)
}