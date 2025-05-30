import db from '@/util/db'

export default async function handler (req, res) {
  const { genres, yearstart, yearend, query, nconst, titletype, ratingsFilter, user_id} = req.query;

  const _genres = genres ? genres : null
  const _yearstart = yearstart ? yearstart : null
  const _yearend = yearend ? yearend : null
  const _query = query ? query : null
  const _nconst = nconst ? nconst : null
  const _titletype = titletype ? titletype : null
  const _ratingsFilter = ratingsFilter ? ratingsFilter : null
  const _user_id = user_id ? user_id : null

  // const { genres, year } = req.query
  const response = await db.count_genres(_genres, _yearstart, _yearend, _query, _nconst, _titletype, _ratingsFilter, _user_id)
  res.status(200).json(response)
}