select tconst, nconst, count(*)
from title_principals_agg
group by 1, 2
having count(*) > 1
;
