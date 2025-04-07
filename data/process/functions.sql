\pset pager 0

drop function if exists get_movie_tconst;
create or replace function get_movie_tconst(
  _tconst text)
  returns table (
tconst text,
titletype text,
title text,
year integer,
averagerating double precision,
numvotes integer,
genres text,
poster_url text,
rating integer
)  language plpgsql IMMUTABLE as 
$$ 
begin 
return query 
select 
  tb.tconst, 
  tb.titletype,
  tb.primaryTitle as title, 
  tb.startYear as year, 
  tb.averagerating, 
  tb.numvotes, 
  tb.genres, 
  -- p.url as poster_url,
  coalesce(p.url, tmdb.poster_path) as poster_url,
  ur.rating
  from title_basics_ex as tb
  left join user_ratings as ur using (tconst)
  left join tmdb using (tconst)
  left join posters as p on p.tconst = tb.tconst and p.error_count < 1
  where tb.tconst = _tconst
;
end $$ ;


select * from get_movie_tconst('tt0039689');

drop function if exists get_only_movie;
create or replace function get_only_movie(
  _title text,
  _year int)
  returns table (
tconst text,
nconst text,
-- career_order bigint,
-- place text,
primaryname text,
primarytitle text,
role text,
startyear integer,
averagerating double precision,
numvotes integer,
genres text,
age integer,
poster_url text,
plot_summary text,
titletype text,
tmdb_id integer,
backdrop_url text,
user_rating integer
)  language plpgsql IMMUTABLE as 
$$ 
begin 

return query 
select tb.tconst, nb.nconst, nb.primaryName, tb.primaryTitle, coalesce(tp.characters, tp.category) as role, tb.startYear, tb.averagerating, tb.numvotes, tb.genres, tb.startYear - nb.birthYear as age, 
  coalesce(p.url, tmdb.poster_path) as poster_url, 
  tmdb.overview as plot_summary,
  tb.titletype,
  tmdb.tmdb_id,
  backdrop_path as backdrop_url,
  ur.rating as user_rating
  from title_basics_ex as tb
  join title_principals_agg as tp using (tconst)
  join name_basics_ex as nb using (nconst)
  left join user_ratings as ur using (tconst)

  left join tmdb using (tconst)
  left join posters as p on p.tconst = tb.tconst and p.error_count < 1
  where tb.startyear = _year 
  and (
    --lower(tb.primarytitle) like  '%' || lower(_title) || '%'
    --or 
    -- lower(_title) like  '%' || lower(tb.primarytitle) || '%'
    -- or
    fulltext @@ to_tsquery('english', replace(_title,' ',' & '))
    or
    _title = tb.primarytitle
  )
  order by levenshtein(_title, tb.primarytitle)
  -- abs (length(_title) - length(tb.primarytitle))
  limit 1
;

end $$ ;

select * from get_only_movie ('The Killing Fields', 1984) limit 3;
  


drop function if exists get_movie;
create
or replace function get_movie(
  _tconst text,
  _user_id integer default null)
returns table (
tconst text,
nconst text,
career_order bigint,
place text,
primaryname text,
primarytitle text,
role text,
startyear integer,
averagerating double precision,
numvotes integer,
genres text,
age integer,
poster_url text,
plot_summary text,
titletype text,
tmdb_id integer,
backdrop_url text,
user_rating integer
)  language plpgsql IMMUTABLE as 
$$ 
begin 

return query 

with center as (
    select c.tconst, c.nconst, c.career_order, 'center' as place
    from careers as c
    where c.tconst=_tconst
    order by c.ordering
), _left as (
    select c.tconst, c.nconst, c.career_order, 'left' as place
    from center as m
    join careers as c using (nconst)
    where c.career_order = m.career_order - 1
), _right as (
    select c.tconst, c.nconst, c.career_order, 'right' as place
    from center as m
    join careers as c using (nconst)
    where c.career_order = m.career_order + 1
), _all as (
select * from center
union all
select * from _left
union all
select * from _right
)
select _all.*, nb.primaryName, tb.primaryTitle, coalesce(tp.characters, tp.category) as role, tb.startYear, tb.averagerating, tb.numvotes, tb.genres, tb.startYear - nb.birthYear as age, 
  coalesce(p.url, tmdb.poster_path) as poster_url, 
  tmdb.overview as plot_summary,
  tb.titletype,
  tmdb.tmdb_id,
  backdrop_path as backdrop_url,
  ur.rating as user_rating
  from _all
  join title_basics_ex as tb using (tconst)
  join name_basics_ex as nb using (nconst)
  join title_principals_agg as tp using (tconst, nconst)
  left join tmdb using (tconst)
  left join user_ratings as ur on ur.tconst=_all.tconst and ur.user_id = _user_id
  left join posters as p on p.tconst = _all.tconst and p.error_count < 1
;

end $$ ;


select * from
get_movie('tt0068646')
limit 3;



drop function if exists get_movies;
create
or replace function get_movies (
  _numMovies integer,
  _genres text,
  _startyear integer,
  _endyear integer,
  _query text,
  _nconst text,
  _titletype text,
  _movieList text[] default null,
  _orderBy text default 'popularity desc',
  _rating_filter text default 'all',
  _user_id integer default null,
  _offset integer default 0
)
returns table (
  source_order int,
tconst text,
genres text,
averagerating double precision,
numvotes integer,
popularity double precision,

nconst text,
place text,
primaryname text,
primarytitle text,
role text,
startyear integer,

age integer,
poster_url text,
plot_summary text,
titletype text,
tmdb_id integer, 
user_rating integer,
user_rating_msg text
) language plpgsql IMMUTABLE as 
$$ 
begin 

return query

with 
exploded as (
select 
  ur.source_order,
  tbe.tconst, 
  tbe.startyear, 
  tbe.averageRating, 
  tbe.numVotes, 
  tbe.popularity,
  ur.rating as user_rating,
  ur.msg as user_rating_msg
from title_basics_ex as tbe
--join full_genres as fg using(genres)
left join user_ratings ur on ur.tconst = tbe.tconst and ur.user_id = _user_id
where 

 --( _genres is null or fg.genres_array @> string_to_array(_genres::text, ',') )
 --and

 (_user_id is null or ur.user_id is null or ur.user_id = _user_id)
 and

(_genres is null or string_to_array(tbe.genres::text, ',') @> string_to_array(_genres::text, ',') )
and

 ( _startyear is null or tbe.startyear >= _startyear::integer)
 and
 (_endyear is null or tbe.startyear <= _endyear::integer)
 and
 (_query is null or _query = tbe.primarytitle or fulltext @@ to_tsquery('english', replace(_query,' ',' & ')))
 and
(_nconst is null or actors_array @> string_to_array(_nconst, ','))
 and 
 (_titletype is null or (_titletype = 'movie' and tbe.titletype = 'movie') or (_titletype != 'movie' and tbe.titletype != 'movie'))
 and
 (_movieList is null or tbe.tconst = ANY(_movieList))

 -- and ur.rating is null
-- and
-- (_rating_filter != 'not rated' or ur.rating is null)

and
(
  (_rating_filter = 'rated' and ur.rating > -3)
  or
  (_rating_filter = 'not rated' and ur.rating is null)
  or 
  (_rating_filter = 'watchlist' and ur.rating = -1)
  or
  (_rating_filter = 'recommendations' and ur.rating = -3)
  or
  _rating_filter = 'all'
)


 order by 
-- -1 * tbe.popularity
  -- ur.rating is not null,
  --case
  --  when _rating_filter = 'no rating' then ur.rating
  --end is not null,
 case 
    when _rating_filter = 'recommendations' then ur.source_order
    when _orderBy = 'popularity desc' then -1 * tbe.popularity
    when _orderBy = 'popularity' then tbe.popularity
    when _orderBy = 'year desc' then -1 * tbe.startyear
    when _orderBy = 'year' then tbe.startyear
 end

 
 limit _numMovies  offset _offset
)

  select e.source_order, tb.tconst, tb.genres, e.averageRating, e.numVotes, e.averageRating * e.numVotes as popularity,
  tp.nconst, 'genres' as place, nb.primaryName, tb.primaryTitle, coalesce(tp.characters, tp.category) as role, tb.startYear, tb.startYear - nb.birthYear as age, 
  coalesce(p.url, tmdb.poster_path) as poster_url, 
  substring(tmdb.overview, 0, 150) as plot_summary,
  tb.titletype,
  tmdb.tmdb_id,
  --2 as user_rating
  e.user_rating,
  e.user_rating_msg
from exploded as e 
join title_basics_ex as tb using (tconst)
join title_principals_agg as tp using (tconst)
join name_basics_ex as nb using (nconst)
left join tmdb using (tconst)
left join posters as p on p.tconst = e.tconst and p.error_count < 1

/*
where

(
  (_rating_filter = 'rated' and e.user_rating is not null)
  or
  (_rating_filter = 'not rated' and e.user_rating is null)
  or 
  (_rating_filter = 'watchlist' and e.user_rating = -1)
  or
  _rating_filter = 'all'
)
*/

order by 
 case 
    when _rating_filter = 'recommendations' then e.source_order
    when _orderBy = 'year' then tb.startyear
    when _orderBy = 'popularity desc' then -1 * e.popularity
    when _orderBy = 'popularity' then e.popularity
    when _orderBy = 'year desc' then -1 * tb.startyear

 end
, tp.ordering
;


end $$ ;

select *
from get_movies(2,  'Crime,Horror',1990, 2024, 'kill', null, 'movie',null)
limit 3;

select *
from get_movies(2,  null, null, null, 'Present Time', null, null,null)
limit 3
;

select 'array query' as nada, *
from get_movies(10, null, null, null, null, null, null, '{"tt0111161", "tt0099685"}')
limit 3;

select *
from get_movies(2,  null, null, null, 'Present Time', null, null,null, 'rated')
limit 3
;

drop function if exists count_genres;
create
or replace function count_genres(
  _genres text,
  _startyear integer,
  _endyear integer,
  _query text,
  _nconst text,
  _titletype text,
  _rating_filter text default 'all',
  _user_id integer default null
)
returns table (
  genre text,
  count integer
)
language plpgsql IMMUTABLE as 
$$ 
begin 

return query 
select g.genre, count(*)::integer
from title_basics_ex as tbe
--join full_genres as fg using(genres)
join genres as g using (tconst)
left join user_ratings ur on ur.tconst = tbe.tconst and ur.user_id = _user_id
where  
-- ( _genres is null or fg.genres_array @> string_to_array(_genres::text, ',') )
-- and

 (_user_id is null or ur.user_id is null or ur.user_id = _user_id)
 and


(_genres is null or string_to_array(tbe.genres::text, ',') @> string_to_array(_genres::text, ',') )
and

 ( _startyear is null or startyear >= _startyear::integer)
 and
 (_endyear is null or startyear <= _endyear::integer)
 and
 (_query is null or fulltext @@ to_tsquery('english', replace(_query,' ',' & ')))
 and
(_nconst is null or actors_array @> string_to_array(_nconst, ','))
 and 
 (_titletype is null or (_titletype = 'movie' and tbe.titletype = 'movie') or (_titletype != 'movie' and tbe.titletype != 'movie'))

and
(
  (_rating_filter = 'rated' and ur.rating > -3)
  or
  (_rating_filter = 'not rated' and ur.rating is null)
  or 
  (_rating_filter = 'watchlist' and ur.rating = -1)
  or
  (_rating_filter = 'recommendations' and ur.rating = -3)
  or
  _rating_filter = 'all'
)

group by 1
order by 1
;

end $$ ;


select *
from count_genres('Comedy,Action', 1980, 1990, null,null, 'movie');


drop function if exists count_ratings;
create
or replace function count_ratings (
  _user_id integer
)
returns table (
  category text,
  cnt integer
)
language plpgsql as 
$$ 
begin 
return query

  with ratings_counts as (
    select rating, count(*)::integer as cnt 
    from user_ratings 
    where user_id = _user_id
    group by 1
  )
  select 'recommended' as category, rc.cnt
  from ratings_counts as rc
  where rating = -3

  union

  select 'rated' as category, coalesce(sum(rc.cnt), 0)::integer as cnt
  from ratings_counts as rc
  where rating > -3

  union

  select 'want_to_see' as category, rc.cnt
  from ratings_counts as rc
  where rating = -1

  union

  select 'do_not_want_to_see' as category, rc.cnt
  from ratings_counts as rc
  where rating = -2
  ;

end $$ ;

select *
from count_ratings(177)
;

