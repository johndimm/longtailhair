\pset pager 0

/*
with tbe as (
  select 
   tbe.tconst, 
  tbe.startyear, 
  tbe.averageRating, 
  tbe.numVotes, 
  tbe.popularity 
  
  from title_basics_ex as tbe
  limit 1000000
)
*/

select 
  tbe.tconst, 
  tbe.startyear, 
  tbe.averageRating, 
  tbe.numVotes, 
  tbe.popularity
from title_basics_ex as tbe
-- from tbe

--  join full_genres as fg using(genres)
 -- ,constants


 order by 5 desc
 limit 24

;

/*
)
select * from exploded
;
*/

/*

  select tb.tconst, tb.genres, e.averageRating, e.numVotes, e.averageRating * e.numVotes as popularity,
  tp.nconst, 'genres' as place, nb.primaryName, tb.primaryTitle, coalesce(tp.characters, tp.category) as role, tb.startYear, tb.startYear - nb.birthYear as age, 
  coalesce(p.url, tmdb.poster_path) as poster_url, 
  -- '' as plot_summary,
  substring(
    coalesce(tmdb.overview, s.plot_summary), 0, 150
  ) as plot_summary,
  tb.titletype,
  tmdb.tmdb_id
  -- coalesce(tmdb.overview, s.plot_summary) as plot_summary
from exploded as e 
join title_basics_ex as tb using (tconst)
join title_principals_agg as tp using (tconst)
join name_basics_ex as nb using (nconst)
left join posters as p using(tconst)
left join summaries as s using (tconst)
left join tmdb using (tconst)
order by e.popularity desc, ordering
-- limit 3
;

*/


/*
with constants as (
  select 'Game-Show' as _genres,
  --null::integer as _startyear,
  --null::integer as _endyear,
  1890 as _startyear,
  2024 as _endyear,
  null as _query,
  null as _nconst,
  'movie' as _titletype,
  24 as _numMovies
)

select unnest(genres_array) as genre, count(*)::integer as count

from title_basics_ex, constants
where 
 ( _genres is null or genres_array @> string_to_array(_genres, ','))
 and
 ( _startyear is null or startyear >= _startyear)
 and
 (_endyear is null or startyear <= _endyear)
 and
 (_query is null or fulltext @@ to_tsquery('english', replace(_query,' ',' & ')))
 and
(_nconst is null or _nconst = ANY (actors_array) )
 and 
 (_titletype is null or titletype = _titletype)

group by 1
order by 1
;

*/



