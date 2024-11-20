\pset pager 0

explain
select count(*)
from gin
where genres = 'Drama'
;

explain
select genres, count(*)
-- from gin
from gin
where 
 genres_array @> string_to_array('Sci-Fi', ',')
group by 1
;

-- create index gin_genres on gin using gin (genres_array);

explain
with data as (
select *
-- genres, count(*)
-- from gin
from gin
-- from title_basics_ex
where 
 genres_array @> string_to_array('Sci-Fi', ',')
order by id
limit 30000
-- group by 1
)
select * from data 
where id < 1000
limit 24
;