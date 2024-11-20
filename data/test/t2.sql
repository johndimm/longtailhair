select tconst, nconst, count(*)
from careers
group by 1, 2
having count(*) > 1
;
