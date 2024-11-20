drop table if exists full_genres;
create table full_genres as
select genres, genres_array, count(*) as cnt
from title_basics_ex
group by 1, 2
;

select count(*)
from full_genres;

create index idx_fg on full_genres(genres);
create index idx_fgarray on full_genres using gin (genres_array);