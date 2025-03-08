import { getAIRecs } from '@/util/recommendations'

export default async function handler(req, res) {
  const {
    query: { user_id, titletype, genres, aiModel }
  } = req

  const recs = await getAIRecs(user_id, titletype, genres, aiModel)

  res.status(200).json(recs)
}