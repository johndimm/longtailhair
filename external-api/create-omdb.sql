drop table if exists omdb;

create table omdb (
    tconst text,
    json_data jsonb,
    omdb_id integer,
    poster text,
    plot text
);

create unique index idx_omdb on omdb(tconst);