drop table if exists gin;
create table gin (
  id serial primary key,
  genres text,
  genres_array text[]
);

insert into gin (genres, genres_array)
select genres, genres_array
from title_basics_ex
;
