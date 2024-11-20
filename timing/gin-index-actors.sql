drop index idx_tbe_actors_array;
create index idx_tbe_actors_array on title_basics_ex using gin(actors_array array_ops);
