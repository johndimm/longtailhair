select *
from process.title_principals_agg as c
where c.fulltext @@ to_tsquery('english', replace('kill',' ',' & '))
--where c.fulltext @@ to_tsquery('english', replace('kill', ',' & '))
;
