import { getAIRecs } from '@/util/recommendations'
import { waitUntil } from '@vercel/functions';


export default async function handler(req, res) {
  const {
    query: { user_id, titletype, genres, aiModel }
  } = req

   waitUntil (
     getAIRecs(user_id, titletype, genres, aiModel)
   )

  res.status(200).json({ 'msg': 'generating recs' })
}