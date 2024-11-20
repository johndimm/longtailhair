drop table if exists po2;
create table po2 as select * from posters where 0=1;
\copy po2 from release-cover-gce-tv-public.tsv;
\copy po2 from posters-tv.tsv
\copy po2 from release-cover-gce_movies.tsv


select count(*)
from po2
left join posters using (tconst)
where posters.tconst is null;

