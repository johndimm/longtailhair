

with matching_movies as (
select distinct tconst
from genres as g1
join genres as g2 using (tconst)
join genres as g3 using (tconst)
where g1.genre = 'Drama'
and g2.genre = 'Comedy'
and g3.genre = 'Romance'
)
select genre, count(*)
from genres
join matching_movies using (tconst)
group by 1
;