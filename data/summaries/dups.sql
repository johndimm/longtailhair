select tconst, count(*)
from summaries
group by 1
having count(*) > 1
;
