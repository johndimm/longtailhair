\pset pager 0

explain
select tconst
from title_basics_ex
where genres_array @> string_to_array('Drama,Comedy', ',')
;
