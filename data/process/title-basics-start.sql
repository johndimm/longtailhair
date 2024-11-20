set search_path to 'process';

-- List only the movies.
drop table if exists title_basics_start;
create table title_basics_start as
select
  tb.*, 
  string_to_array(genres, ',') as genres_array
from raw_data.title_basics as tb
where 
  --titleType = 'movie'

  titleType in ('tvSeries', 'tvMovie', 'tvMiniSeries', 'movie')
-- and
--  titleType not in ('video', 'videoGame')
;

create index idx_tbes_tconst on title_basics_start (tconst);
-- create index idx_tbe_genres on title_basics_start (genres);
create index idx_tbes_genres_array on title_basics_start (genres_array);
create index idx_tbes_year on title_basics_start (startYear);
-- create index idx_tbe_fulltext on title_basics_start using GIN (fulltext);

