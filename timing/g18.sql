select unnest(tbe.genres_array), count(*)
from title_basics_ex as tbe
join full_genres as fg on fg.genres = tbe.genres
and fg.genres_array @> string_to_array('Comedy,Drama'::text, ',')

group by 1
;
