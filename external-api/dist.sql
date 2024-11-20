select not(url is null and tmdb.poster_path is null), round(coalesce(averagerating,0)), count(*)
from process.title_basics_ex as tbe
left join posters using (tconst)
left join tmdb using (tconst)
left join process.title_ratings_ex using (tconst)
group by 1,2
order by 1,2
;
