drop table if exists posters;
create table posters (
  tconst text,
  url text,
  error_count integer
);

\copy posters from omdb-posters.tsv

create index idx_posters on posters(tconst);
