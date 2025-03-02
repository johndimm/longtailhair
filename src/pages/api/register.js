import db from '@/util/db'

export default async function handler (req, res) {
  const { email, name } = req.query

  const result = await db.register(email, name)
  const user_id = result && result.length > 0 
    ? result[0].user_id
    : null

  res.status(200).json( {user_id: user_id} )
}