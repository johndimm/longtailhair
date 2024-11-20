select unnest(genres_array), count(*)::integer as count
from title_basics_ex as e
group by 1
order by 1
;