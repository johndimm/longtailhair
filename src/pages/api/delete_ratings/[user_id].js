import db from '@/util/db'

export default async function handler (req, res) {
  const {
        query: { user_id }
    } = req

  const response = await db.delete_ratings(user_id)
  res.status(200).json(response)
}