select concat('./omdb-get.sh ', p.tconst) as cmd
from posters as p
left join omdb using (tconst)
where 
omdb.tconst is null 
--and p.url not like '%tmdb%'
;
