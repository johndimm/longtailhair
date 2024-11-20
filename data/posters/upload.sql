drop table if exists posters;
create table posters (
  tconst text,
  url text
);

\copy posters from posters.tsv

create index idx_posters on posters(tconst);
