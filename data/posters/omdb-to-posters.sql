drop table if exists tmp;
create table tmp as
select tconst, poster as url, 0 as error_count
from omdb
where poster != 'N/A'
;

\copy tmp to 'omdb-posters.tsv';
