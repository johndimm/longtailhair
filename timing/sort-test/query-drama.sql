--explain
select 
  id,
  popularity
from tmp
-- from title_basics_ex
where 
genres = 'Drama'
-- genres = 'Talk-Show'
 order by 2 desc
 limit 24
