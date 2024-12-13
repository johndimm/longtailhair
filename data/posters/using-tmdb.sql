select count(*)
from title_basics_ex as tbe
left join posters using (tconst)
join tmdb using (tconst)
where posters.tconst is null
;
