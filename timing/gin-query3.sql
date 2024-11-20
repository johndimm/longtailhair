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
limit 24
-- group by 1
)
select * from data
;