set schema 'public';

-- List only the movies.
drop table if exists title_basics_ex;
create table title_basics_ex as
with movie_actors as (
  select 
    tpa.tconst, 
    array_to_string(array_agg(nb.primaryName), ', ') as actors,
    array_agg(nb.nconst) as actors_array
  from title_principals_agg as tpa
  join raw_data.name_basics as nb using (nconst)
  join raw_data.title_basics as tb using (tconst)

  -- where titleType = 'movie'
  group by 1
)
select
  tb.*, 
  averagerating, numvotes, coalesce(averagerating * numvotes,0) as popularity,
  ma.actors_array,
  to_tsvector('english', concat(tb.primaryTitle, ': ', ma.actors)) as fulltext
from process.title_basics_start as tb
join movie_actors as ma using (tconst)
left join raw_data.title_ratings as tr using (tconst)
;

create index idx_tbe_tconst on title_basics_ex (tconst);
create index idx_tbe_year on title_basics_ex (startYear);
create index idx_tbe_titletype on title_basics_ex(titletype);
-- create index idx_tbe_pop on title_basics_ex(popularity);

create index idx_tbe_fulltext on title_basics_ex using GIN (fulltext);
create index idx_tbe_genres_array on title_basics_ex using GIN (genres_array);
create index idx_tbe_actors_array on title_basics_ex using GIN (actors_array);

