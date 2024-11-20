-- set jit=off;

-- explain
with constants as (
select 'Comedy,Drama' as _genres
)
select g.genre, count(*)
from title_basics_ex as tbe
join genres as g using (tconst)
, constants
where 
  position ('Romance' in genres) > 0
and
  position('Comedy' in genres) > 0
--  genres = _genres
-- genres like concat('%', _genres, '%')
-- position (_genres in genres) > 0
-- genres_array @> string_to_array('Drama,Comedy', ',')
group by 1
;
