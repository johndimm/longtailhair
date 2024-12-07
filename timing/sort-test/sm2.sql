\pset pager 0

SET enable_seqscan = OFF;


--explain

with constants as (
  select 'Adult' as _genres,
  null as _startyear,
  null as _endyear,
  null as _query,
  null as _nconst,
  null as _titletype,
  24 as _numMovies
)


select 
  tbe.tconst,  
  tbe.popularity
from title_basics_ex as tbe
--join full_genres as fg using(genres)
  ,constants

where 

-- tbe.genres = 'Adult'
-- position('Adult' in tbe.genres) > 0


-- ( _genres is null or fg.genres_array @> string_to_array(_genres::text, ',') )
( _genres is null or tbe.genres_array @> string_to_array(_genres::text, ',') )

and
 ( _startyear is null or tbe.startyear >= _startyear::int)
 and
 (_endyear is null or tbe.startyear <= _endyear::int)
 and
 (_query is null or tbe.fulltext @@ to_tsquery('english', replace(_query,' ',' & ')))
 and 
 (_nconst is null or _nconst = ANY (tbe.actors_array) )
 and 
 (_titletype is null or tbe.titletype = _titletype)
 

 order by 2 desc
 limit 24

--)
-- select * from exploded
;