create index idx_tmp_id on tmp(id);
create index idx_tmp_pop on tmp(popularity);
create index idx_tmp_genres on tmp(genres);

analyze tmp;


-- drop index idx_tmp_genres_array;
-- create index idx_tmp_genres_array on tmp using GIN (genres_array);