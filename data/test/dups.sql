\x
select 
    tp.tconst, -- (string) - alphanumeric unique identifier of the title
    tp.nconst, -- (string) - alphanumeric unique identifier of the name/person
    min(tp.ordering) as ordering, -- (integer) – a number to uniquely identify rows for a given titleId
    string_agg(tp.category, ', ' ) as category,
    string_agg(tp.characters, ', ') as characters -- (string) - the name of the character played if applicable, else '\N'
from
    raw_data.title_principals as tp
join 
    raw_data.title_basics as tb using (tconst)
join 
    raw_data.name_basics as nb using (nconst)
--join
--    process.title_principals_ex as tpe using (tconst, nconst)
where tconst='tt5463162' and nconst='nm0005351'
group by 1,2
;
