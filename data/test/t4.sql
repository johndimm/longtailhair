
--
-- some movies have no ratings
--
-- explain
with exploded as (
select 
  tbe.tconst, 
  tbe.startyear, 
  tbe.averageRating, 
  tbe.numVotes, 
  -- coalesce(tbe.popularity,0) as popularity
  tbe.popularity
from title_basics_ex as tbe
where 
( null is null or tbe.genres_array @> string_to_array('Drama', ','))
and
( 1960 is null or tbe.startyear >= 1960)
and
( 1970 is null or tbe.startyear <= 1970)



order by 5 desc
 limit 10
)
select * from exploded limit 10;

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
;

*/
