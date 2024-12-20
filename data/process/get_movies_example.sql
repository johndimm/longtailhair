-- explain
with constants as (
  select null as _genres,
  null as _startyear,
  null as _endyear,
  null as _query,
  null as _nconst,
  'movie' as _titletype,
  8 as _numMovies
), 
exploded as (
select 
  tbe.tconst, 
  tbe.startyear, 
  tbe.averageRating, 
  tbe.numVotes, 
  tbe.popularity
from title_basics_ex as tbe
join full_genres as fg using(genres),
constants
where 

 ( _genres is null or fg.genres_array @> string_to_array(_genres::text, ',') )
 and
 ( _startyear is null or tbe.startyear >= _startyear::integer)
 and
 (_endyear is null or tbe.startyear <= _endyear::integer)
 and
 (_query is null or fulltext @@ to_tsquery('english', replace(_query,' ',' & ')))
 and
(_nconst is null or actors_array @> string_to_array(_nconst, ','))
 and 
 (_titletype is null or (_titletype = 'movie' and tbe.titletype = 'movie') or (_titletype != 'movie' and tbe.titletype != 'movie'))

 order by 5 desc
 limit 8
)
-- select * from exploded;


  select tb.tconst, p.error_count
  
  /*
  , tb.genres, e.averageRating, e.numVotes, e.averageRating * e.numVotes as popularity,
  tp.nconst, 'genres' as place, nb.primaryName, tb.primaryTitle, coalesce(tp.characters, tp.category) as role, tb.startYear, tb.startYear - nb.birthYear as age, 
  coalesce(p.url, tmdb.poster_path) as poster_url, 
  substring(tmdb.overview, 0, 150) as plot_summary,
  tb.titletype,
  tmdb.tmdb_id
  -- coalesce(tmdb.overview, s.plot_summary) as plot_summary

  */

from exploded as e 
join title_basics_ex as tb using (tconst)


join title_principals_agg as tp using (tconst)
join name_basics_ex as nb using (nconst)
left join tmdb using (tconst)
left join posters as p on p.tconst = e.tconst and p.error_count < 1
--where p.error_count is null -- or p.error_count = 0
--order by e.popularity desc, ordering

;

