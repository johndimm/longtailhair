drop table if exists genres;
create table genres as
select tconst, unnest(genres_array) as genre
from title_basics_ex;

create index idx_genres_tconst on genres(tconst);
create index idx_genres_genres on genres(genre);

select genre, count(*)
from genres
group by 1;