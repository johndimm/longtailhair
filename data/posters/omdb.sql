select concat('./omdb-get.sh ', tbe.tconst) as cmd
from title_basics_ex as tbe
left join omdb using (tconst)
where omdb.tconst is null
order by tbe.popularity desc
limit 100000
;

