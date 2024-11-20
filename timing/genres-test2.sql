\pset pager 0
-- set enable_seqscan=false;

explain
select *
from title_basics_ex
where
genres_array @> string_to_array('Drama,Musical,Mystery', ',')
;

