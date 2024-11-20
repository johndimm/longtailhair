

/*
drop table if exists full_genres;
create table full_genres as
select genres, genres_array, count(*) as cnt
from title_basics_ex
group by 1, 2
;

select count(*)
from full_genres;



create index idx_fg on full_genres(genres);
create index idx_fgarray on full_genres using gin (genres_array);
*/

--select tbe.genres, count(*)

with constants as (
  select 'Drama' as _genres,
  --null::integer as _startyear,
  --null::integer as _endyear,
  null as _startyear,
  null as _endyear,
  null as _query,
  null as _nconst,
  'movie' as _titletype,
  24 as _numMovies
)
-- select unnest(tbe.genres_array), count(*)
select g.genre, count(*)

from title_basics_ex as tbe
join full_genres as fg using(genres)
join genres as g using (tconst)
, constants
where 
 ( _genres is null or fg.genres_array @> string_to_array(_genres::text, ',') )
 and
 ( _startyear is null or startyear >= _startyear::integer)
 and
 (_endyear is null or startyear <= _endyear::integer)
 and
 (_query is null or fulltext @@ to_tsquery('english', replace(_query,' ',' & ')))
 and
(_nconst is null or actors_array @> string_to_array(_nconst, ','))
 and 
 (_titletype is null or titletype = _titletype)

group by 1
;
