const { Pool } = require('pg');

const pgOptions = {
    connectionString: process.env.DATABASE_URL_GCE,
    ssl: false ,
    rejectUnauthorized: false 
}

// console.log(pgOptions)
const pool = new Pool(pgOptions);

// pg will convert dates to datetimes by default, we don't want that.
var types = require('pg').types;
types.setTypeParser(types.builtins.DATE, (str) => str);

async function performSQLQuery(query) {
    //console.log('===> pool: ', JSON.stringify(pool))
    console.log('===> performSQLQuery, query: \n', query);

    try {
        const response = await pool.query(query);
        //console.log('===> performSQLQuery, response:', response);
        return response.rows;
    } catch (error) {
        console.log('===> performSQLQuery, error:', error);
        return error;
    }
}

exports.get_movie_tconst = function (tconst) {
  if (tconst == 'undefined')
    return []

  const cmd = `
    select tconst, title, rating, year, poster_url, genres
    from get_movie_tconst('${tconst}');`
  console.log(cmd)

	return performSQLQuery(cmd);
};

exports.get_only_movie = function (title, date) {
  if (title == 'undefined')
    return []

  const titleEsc =title.replace(/'/g,"''")

  const cmd = `select * from get_only_movie('${titleEsc}', ${date});`
  console.log(cmd)

	return performSQLQuery(cmd);
};

exports.get_movie = function (tconst, user_id) {
  if (tconst == 'undefined')
    return []

	return performSQLQuery(`select * from get_movie('${tconst}', ${user_id});`);
};

exports.get_movie_list = function (movieList) {
  const quotedMovieList = movieList.map ( (m, idx) => {
    return `"${m}"`
  })
  const cmd = `select * from get_movies(100, null, null, null, null, null, null,'{${quotedMovieList}}');`
  console.log(cmd)
  return performSQLQuery(cmd)
}

exports.recommend_movie_list = function (user_id, movieList) {
  const quotedMovieList = movieList.map ( (m, idx) => {
    return `"${m}"`
  })
  const cmd = `select * from recommend_movie_list(${user_id},'{${quotedMovieList}}');`
  console.log(cmd)
  return performSQLQuery(cmd)
}

function isNullish (query) {
    return !query || query === 'undefined' || query === 'null' || query === ''
}
exports.get_movies = function (numMovies, genres, yearstart, yearend, 
  query, nconst, titletype, movieList, sortOrder, ratingsFilter, user_id, offset) {
    const _genres = isNullish(genres) ? null : `'${genres}'`
    const _yearstart = isNullish(yearstart) ? null : yearstart
    const _yearend = isNullish(yearend) ? null : yearend
    const _query = isNullish(query) ? null : `'${query}'`
    const _nconst = isNullish(nconst) ? null : `'${nconst}'`
    const _titletype = isNullish(titletype) ? null : `'${titletype}'`
    const _sortOrder = isNullish(sortOrder) ? null : `'${sortOrder}'`
    const _ratingsFilter = isNullish(ratingsFilter) ? null : `'${ratingsFilter}'`
    const _offset = isNullish(offset) ? 0 : offset

    // console.log(query, _query)
	const data = performSQLQuery(`select * from get_movies(${numMovies}, ${_genres}, ${_yearstart}, ${_yearend}, ${_query}, ${_nconst}, ${_titletype}, ${movieList}, ${_sortOrder}, ${_ratingsFilter}, ${user_id}, ${_offset});`);
    return data
};

exports.count_genres = function (genres, yearstart, yearend, query, nconst, titletype, ratingsFilter, user_id) {
    const _genres = isNullish(genres) ? null : `'${genres}'`
    const _yearstart = isNullish(yearstart) ? null : yearstart
    const _yearend = isNullish(yearend) ? null : yearend
    const _query = isNullish(query) ? null : `'${query}'`
    const _nconst = isNullish(nconst) ? null : `'${nconst}'`
    const _titletype = isNullish(titletype) ? null : `'${titletype}'`
    const _ratingsFilter = isNullish(ratingsFilter) ? null : `'${ratingsFilter}'`
    // console.log(query, _query)
	return performSQLQuery(`select * from count_genres(${_genres}, ${_yearstart}, ${_yearend}, ${_query}, ${_nconst}, ${_titletype}, ${_ratingsFilter}, ${user_id} );`);
}

exports.insertDB = async function (tconst, jsonData) {
    const width=200
    const url_prefix = `https://image.tmdb.org/t/p/w${width}/`
    const tmdb_id = jsonData.id

    const jsonString = JSON.stringify(jsonData).replace(/'/g,"''")
    const cmd = `
    INSERT INTO tmdb
    SELECT '${tconst}' as tconst, 
      ${tmdb_id} as tmdb_id,

      case 
        when poster_path is not null 
        then concat('${url_prefix}', poster_path) 
      else 
        null 
      end as poster_path, 

      case 
        when backdrop_path is not null 
        then concat('${url_prefix}', backdrop_path) 
      else 
        null 
      end as backdrop_path, 

      overview
    FROM json_populate_record (NULL::tmdb,'${jsonString}');
    `
    // console.log(cmd)

    return await performSQLQuery(cmd)  
}

exports.markPoster = async function (tconst) {
    const cmd = `update posters set error_count = error_count + 1 where tconst='${tconst}'`
    return await performSQLQuery(cmd)
}

exports.insertOMDB = async function (tconst, jsonData) {
  const jsonDataString = JSON.stringify(jsonData).replace(/'/g, "''")
  const plot = jsonData.Plot ? jsonData.Plot.replace(/'/g, "''") : ''

   const cmd = `insert into omdb (tconst, json_data, poster, plot) 
   values ('${tconst}', '${jsonDataString}', '${jsonData.Poster}', '${plot}')`

   
   return await performSQLQuery(cmd)
}

exports.setUserRating = async function (user_id, tconst, rating) {
  let cmd = `insert into user_ratings (user_id, tconst, rating) 
  values (${user_id}, '${tconst}', ${rating}) 
  ON CONFLICT (user_id, tconst) DO UPDATE 
  SET rating=EXCLUDED.rating`

  await performSQLQuery(cmd)

  cmd = `
  select count(*) as cnt 
  from user_ratings 
  where user_id=${user_id} and rating != -3`
  const result = await performSQLQuery(cmd)
  const nRatings = result[0].cnt

  const json = {"count": nRatings}
  console.log(json)

  return json
}

exports.getUserRatings = async function (user_id) {
  const cmd = `select 
    ur.user_id, ur.tconst, tbe.primarytitle as title, ur.rating, tbe.startyear as year,
    coalesce(p.url, tmdb.poster_path) as poster_url
    from user_ratings as ur
    join title_basics_ex as tbe using (tconst)
    left join tmdb using (tconst)
    left join posters as p on p.tconst = ur.tconst and p.error_count < 1
    where ur.user_id = ${user_id}
    order by 3`
  return await performSQLQuery(cmd)
}

exports.performQuery = async function (query) {
  return await performSQLQuery(query)
}

exports.register = async function (email, name) {
  const cmd = `
    insert into users (email,name) values ('${email}', '${name}') on conflict (email) do nothing
  `
  await performSQLQuery(cmd)

  const query = `
    select id as user_id from users where email='${email}'
  `

  return await performSQLQuery(query)
}

exports.get_num_ratings = async function (user_id) {
  const query = `
  select count(*) as num_ratings 
  from user_ratings 
  where user_id=${user_id} and rating != -3
  `

  return await performSQLQuery(query)
}

exports.delete_ratings = async function (user_id) {
  const cmd = `delete from user_ratings where user_id=${user_id}`
  return await performSQLQuery(cmd)

}