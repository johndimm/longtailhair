set schema 'process';

-- List only the principals in movies
drop table if exists title_principals_ex;
create table title_principals_ex as
-- select distinct tb.tconst, tb.nconst, tb.ordering
select tb.*
from raw_data.title_principals as tb 
join title_basics_start tbe using (tconst)
;

create index idx_tpe_tconst on title_principals_ex(tconst);
create index idx_tpe_nconst on title_principals_ex(nconst); 
