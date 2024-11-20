set schema 'process';

drop table if exists title_ratings_ex;

create table title_ratings_ex as
select *, averageRating * numVotes as popularity
from raw_data.title_ratings
join process.title_basics_ex using (tconst)
;

create index idx_tre_tconst on title_ratings_ex(tconst);
create index idx_tre_pop on title_ratings_ex(popularity);