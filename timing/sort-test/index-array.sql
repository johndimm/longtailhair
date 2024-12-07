create index idx_tmp_id on tmp(tconst);
create index idx_tmp_pop on tmp(popularity);
create index idx_tmp_genres on tmp using GIN(genres_array);

analyze tmp;
