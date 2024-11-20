set schema 'public';

-- Only the principals in selected movies and tv.
drop table if exists name_basics_ex;
create table name_basics_ex as
select nb.*
from raw_data.name_basics as nb 
join (
    select distinct nconst from title_principals_agg
) as t using (nconst)
;

create index idx_nbe_nconst on name_basics_ex(nconst); 