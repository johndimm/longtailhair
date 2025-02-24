import db from '@/util/db'

export default async function handler(req, res) {
    const {
      query: { user_id, titletype }
    } = req

    let actualTitletype
    let msg
    if (titletype == 'movie') {
      actualTitletype = 'movie'
      msg = "because this is a popular movie"
    } else {
      actualTitletype = 'tvSeries'
      msg = "because this is a popular tv series"
    }
  
    const addRecs = `
      insert into user_ratings
      (user_id, tconst, rating, msg)
      select ${user_id} as user_id, tbe.tconst, -3 as rating, '${msg}' as msg
      from title_basics_ex as tbe
      left join user_ratings as ur on ur.tconst = tbe.tconst and ur.user_id=${user_id}
      where ur.tconst is null
      and tbe.titletype = '${actualTitletype}'
      order by tbe.popularity desc
      limit 10
    `
    const json = await db.performQuery(addRecs)
  
    res.status(200).json(json)
  }