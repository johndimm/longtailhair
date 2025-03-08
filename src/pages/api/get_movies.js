import db from '@/util/db'
import { tmdb_fill } from '@/util/tmdb_fill'
import {getSimpleRecs, getAIRecs } from '@/util/recommendations'


export default async function handler(req, res) {
  const {
    query: { numMovies, genres, yearstart, yearend, query, nconst, titletype, orderBy, ratingsFilter, user_id }
  } = req

  const _numMovies = numMovies ? numMovies : null
  const _genres = genres ? genres : null
  const _yearstart = yearstart ? yearstart : null
  const _yearend = yearend ? yearend : null
  const _query = query ? query : null
  const _nconst = nconst ? nconst : null
  const _titletype = titletype ? titletype : null
  const _orderBy = orderBy ? orderBy : null
  const _ratingsFilter = ratingsFilter ? ratingsFilter : null
  const _user_id = user_id ? user_id : null

  let data
  const runQuery = async () => {
    data = await db.get_movies(numMovies, _genres, _yearstart, _yearend, _query, _nconst, _titletype, null, _orderBy, _ratingsFilter, _user_id)

    await tmdb_fill(data)
  }

  await runQuery()

  /*

  if (ratingsFilter == 'recommendations') {
    // Count the number of movies.  The results have every actor.
    const tconsts = {}
    data.forEach((r, idx) => {
      tconsts[r.tconst] = 1
    })

    const nReturnedMovies = Object.keys(tconsts).length

    if (nReturnedMovies == 4) {
      getAIRecs(_user_id, titletype, genres)
    }
    if (nReturnedMovies == 0) {
      await getSimpleRecs(_user_id, titletype, genres)
      await runQuery()
    }
  }
    */

  res.status(200).json(data)
}