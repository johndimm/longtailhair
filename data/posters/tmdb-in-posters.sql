select titletype, p.url like '%tmdb%' as tmdb, count(*)
from posters as p
join title_basics_ex as tbe using (tconst)
group by 1, 2
;
