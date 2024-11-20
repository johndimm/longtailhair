--explain
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
select unnest(genres_array) as genre, count(*)::integer as count
from title_basics_ex,
  constants
where 
 ( _genres is null or genres_array @> string_to_array(_genres, ','))
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
order by 1
;
