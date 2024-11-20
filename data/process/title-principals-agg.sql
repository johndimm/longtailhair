set search_path to "public";

-- Aggregate the categories (writer, producer, director)
-- Fancis Coppola is writer, producer, and director on The Godfather
drop table if exists title_principals_agg;
create table title_principals_agg as
select 
    tp.tconst, -- (string) - alphanumeric unique identifier of the title
    tp.nconst, -- (string) - alphanumeric unique identifier of the name/person
    min(tp.ordering) as ordering, -- (integer) – a number to uniquely identify rows for a given titleId
    string_agg(tp.category, ', ' ) as category,
    string_agg(tp.characters, ', ') as characters -- (string) - the name of the character played if applicable, else '\N'
from
    -- raw_data.title_principals as tp
    process.title_principals_ex as tp
join 
    raw_data.title_basics as tb using (tconst)
join 
    raw_data.name_basics as nb using (nconst)
--join
--    title_principals_ex as tpe using (tconst, nconst)
group by 1,2
;

create index idx_tpa_tconst on title_principals_agg(tconst);
create index idx_tpa_nconst on title_principals_agg(nconst);




