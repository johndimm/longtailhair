drop index idx_tbe_genres_array;
create index idx_tbe_genres_array on title_basics_ex using gin(genres_array array_ops);
