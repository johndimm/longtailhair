drop table if exists tmp;
create table tmp as (
    select * from tmdb
    where 0 = 1
);

\copy tmp from tmdb.tsv delimiter E'\t';

insert into tmdb
select * from tmp
on conflict do nothing;