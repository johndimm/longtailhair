\pset pager 0

drop function if exists get_movie;
create
or replace function get_movie(
  _tconst text)
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
tmdb_id integer
)  language plpgsql STABLE as 
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
  coalesce(tmdb.overview, s.plot_summary) as plot_summary,
  tb.titletype,
  tmdb.tmdb_id
  from _all
  join title_basics_ex as tb using (tconst)
  join name_basics_ex as nb using (nconst)
  join title_principals_agg as tp using (tconst, nconst)
  left join posters as p using(tconst)
  left join summaries as s using (tconst)
  left join tmdb using (tconst)
;

end $$ ;


select * from
get_movie('tt0068646')
limit 3;



drop function if exists get_movies;
create
or replace function get_movies(
  _numMovies integer,
  _genres text,
  _startyear integer,
  _endyear integer,
  _query text,
  _nconst text,
  _titletype text)
returns table (
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
tmdb_id integer
) language plpgsql STABLE as 
$$ 
begin 

return query execute '

--
-- some movies have no ratings
--
with exploded as (
select 
  tbe.tconst, 
  tbe.startyear, 
  tbe.averageRating, 
  tbe.numVotes, 
  tbe.popularity
from title_basics_ex as tbe
join full_genres as fg using(genres)
where 
 ( $2 is null or fg.genres_array @> string_to_array($2::text, '','') )
 and
 ( $3 is null or tbe.startyear >= $3)
 and
 ( $4 is null or tbe.startyear <= $4)
and
 ( $5 is null or tbe.fulltext @@ to_tsquery(''english'', replace($5,'' '','' & '')))
 and 
 ( $6 is null or $6 = ANY (tbe.actors_array) )
 and 
 ( $7 is null or tbe.titletype = $7)

 order by 5 desc
 limit $1
)

  select tb.tconst, tb.genres, e.averageRating, e.numVotes, e.averageRating * e.numVotes as popularity,
  tp.nconst, ''genres'' as place, nb.primaryName, tb.primaryTitle, coalesce(tp.characters, tp.category) as role, tb.startYear, tb.startYear - nb.birthYear as age, 
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
-- where e.averageRating is not null
order by e.popularity desc, ordering
;
' using 
_numMovies,
_genres,
_startyear,
_endyear,
_query,
_nconst,
_titletype
;

end $$ ;

select *
from get_movies(2,  'Crime,Horror',1990, 2024, 'kill', null, 'movie')
limit 3;



/*

drop function if exists count_genres;
create
or replace function count_genres(
  _genres text,
  _startyear integer,
  _endyear integer,
  _query text,
  _nconst text,
  _titletype text
)
returns table (
  genre text,
  count integer
)
language plpgsql STABLE as 
$$ 
begin 

return query execute '
select unnest(genres_array) as genre, count(*)::integer as count
from title_basics_ex as tbe
where

 ( $2  is null or tbe.genres_array @> string_to_array($2, '',''))
 and
 ( $3 is null or tbe.startyear >= $3)
 and
 ( $4 is null or tbe.startyear <= $4)
and
 ( $5 is null or tbe.fulltext @@ to_tsquery(''english'', replace($5,'' '','' & '')))
 and 
 ( $6 is null or $6 = ANY (tbe.actors_array) )
 and 
 ( $7 is null or tbe.titletype = $7)

group by 1
order by 1
;' using 
'',
_genres,
_startyear,
_endyear,
_query,
_nconst,
_titletype
;

end $$ ;

*/


drop function if exists count_genres;
create
or replace function count_genres(
  _genres text,
  _startyear integer,
  _endyear integer,
  _query text,
  _nconst text,
  _titletype text
)
returns table (
  genre text,
  count integer
)
language plpgsql STABLE as 
$$ 
begin 

return query 


select g.genre, count(*)::integer
from title_basics_ex as tbe
join full_genres as fg using(genres)
join genres as g using (tconst)
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


/*

select unnest(genres_array) as genre, count(*)::integer as count
from title_basics_ex
where 
 ( _genres is null or genres_array @> string_to_array(_genres, ','))
 and
 ( _startyear is null or startyear >= _startyear)
 and
 (_endyear is null or startyear <= _endyear)
 and
 (_query is null or fulltext @@ to_tsquery('english', replace(_query,' ',' & ')))
 and
(_nconst is null or actors_array @> string_to_array(_nconst, ','))
 and 
 (_titletype is null or titletype = _titletype)

*/

group by 1
order by 1
;

end $$ ;



select *
from count_genres('Comedy,Action', 1980, 1990, null,null, 'movie');

