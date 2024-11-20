explain
select tr.tconst
from process.title_ratings_ex as tr
join process.title_basics_ex as tbe using (tconst)
left join posters as p using (tconst)
left join tmdb using (tconst)
left join summaries as s using (tconst)
where p.url is null
and tmdb.tconst is null
and tbe.titletype = 'movie'
order by averagerating * numvotes desc
;
