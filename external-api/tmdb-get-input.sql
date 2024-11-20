/*
select tbe.startyear, count(*)
from process.title_ratings_ex as tr
join process.title_basics_ex as tbe using (tconst)
left join posters as p using (tconst)
left join tmdb using (tconst)
-- left join summaries as s using (tconst)
where p.url is null
and tmdb.tconst is null
-- order by tbe.startyear desc
group by 1
order by 1 desc
*/



drop table if exists tmp;
create temporary table tmp as
select tr.tconst
from process.title_ratings_ex as tr
join process.title_basics_ex as tbe using (tconst)
left join tmdb using (tconst)
left join summaries as s using (tconst)
where tmdb.tconst is null
--and tbe.titletype in ('tvSeries', 'tvMiniSeries', 'tvMovie')
and tbe.titletype = 'movie'
order by averagerating * numvotes desc
-- and length(s.plot_summary) > 700
-- order by length(s.plot_summary) desc 
limit 300;

\copy tmp to titles.tsv delimiter E'\t';
