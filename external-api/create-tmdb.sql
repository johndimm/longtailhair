drop table if exists tmdb;

create table tmdb (
    tconst text,
    tmdb_id integer,
    poster_path text,
    backdrop_path text,
    overview text
);

drop index if exists idx_tmdb;
create unique index idx_tmdb on tmdb(tconst);