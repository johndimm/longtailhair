import { getAIRecsPrompt } from '@/util/recommendations'

export default async function handler(req, res) {
  const {
    query: { user_id, titletype, genres, aiModel }
  } = req

  const prompt = await getAIRecsPrompt(user_id, titletype, genres, aiModel)

  res.status(200).json(prompt)
}