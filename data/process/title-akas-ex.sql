set schema 'process';

-- List only the movies.
drop table if exists title_akas_ex;
create table title_akas_ex as
select 
  ta.titleid as tconst,
  min(ta.language) as language
from raw_data.title_akas as ta
join title_basics_ex as tbe on tbe.tconst = ta.titleId
where region = 'US'
and ta.language is not null
group by 1
;

create index idx_tae_tconst on title_akas_ex (tconst);
