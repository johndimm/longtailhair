with matching_movies as (
select tconst
from genres as g1
where g1.genre = 'Drama'
)
select genre, count(*)
from genres
join matching_movies using (tconst)
group by 1
;