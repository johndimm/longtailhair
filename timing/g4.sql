-- set jit=off;

explain
select g.genre, count(*)
from title_basics_ex as tbe
join genres as g using (tconst)
where genres_array @> string_to_array('Drama,Comedy', ',')
group by 1
;
