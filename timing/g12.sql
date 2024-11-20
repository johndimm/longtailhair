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
), c2 as (
    select
        array_length(string_to_array(_genres, ','), 1) as num_genres,
        string_to_array(_genres, ',') as input_genres_array
    from
        constants
),
matching_movies as (
    select
        distinct tconst
    from
        genres as g1
        join genres as g2 using (tconst)
        join genres as g3 using (tconst)
        join title_basics_ex using (tconst) as tbe,
        constants,
        c2
    where
        (
            num_genres < 1
            or g1.genre = input_genres_array[1]
        )
        and (
            num_genres < 2
            or g2.genre = input_genres_array[2]
        )
        and (
            num_genres < 3
            or g3.genre = input_genres_array[3]
        )

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

)
select g.genre, count(*)::integer as count
from genres as g
join matching_movies using(tconst)
  , constants, c2
group by 1
order by 1
;