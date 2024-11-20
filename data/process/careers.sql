drop table if exists careers;
create table careers as
select 
  tp.*, 
   row_number() over (
    partition by tp.nconst
    order by startYear, tconst
   ) as career_order
from title_principals_agg as tp
join title_basics_ex as tb using (tconst)
join name_basics_ex as nb using (nconst)
order by tp.nconst, startYear, tp.tconst
;

create index idx_careers_tconst on careers (tconst);
create index idx_careers_nconst on careers (nconst);