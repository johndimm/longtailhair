--explain
select unnest(genres_array) as genre, count(*)
from title_basics_ex
group by 1
;
