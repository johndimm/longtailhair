-- explain
with c as (
  select 'Comedy' as _genres,
  --null::integer as _startyear,
  --null::integer as _endyear,
  null as _startyear,
  null as _endyear,
  null as _query,
  null as _nconst,
  'movie' as _titletype,
  24 as _numMovies
),
c2 as (
    select
        array_length(string_to_array(_genres, ','), 1) as num_genres,
        string_to_array(_genres, ',') as input_genres_array
    from
        c
)

/*
,

selected_movies as (
    select tbe.tconst
    from title_basics_ex as tbe
    join genres as g1 using (tconst)
    , c
    where
    g1.genre = tbe.genres
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
*/

/*
, selected_movies as (
    select tconst
    from title_basics_ex, c
    where genres = _genres
)


select
    genre,
    count(*)
from
    genres
    join selected_movies using (tconst)

group by
    1;

*/

select g.genre, count(*)
from genres as g
join title_basics_ex as tbe using (tconst), c
where position(_genres in tbe.genres) > 0
group by 1
;