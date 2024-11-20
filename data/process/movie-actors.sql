set schema 'process';

select tpa.tconst, array_to_string(array_agg(tbe.primaryName), ', ') as actors
from title_principals_agg as tpa
join raw_data.name_basics as tbe using (nconst)
group by 1
limit 10
;  
