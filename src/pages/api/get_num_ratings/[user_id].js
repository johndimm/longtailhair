import db from '@/util/db'

export default async function handler (req, res) {
  const {
        query: { user_id }
    } = req

  const response = await db.get_num_ratings(user_id)
  res.status(200).json(response)
}