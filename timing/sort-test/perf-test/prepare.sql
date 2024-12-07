drop table if exists tmp;
create table tmp (
    id serial primary key,
    genres text,
    popularity integer,
    dummy text
);

insert into tmp (genres, popularity, dummy)
select 
  genres, popularity,
  'They''re ordinary husband and wife realtors until she undergoes a dramatic change that sends them down a road of death and destruction. In a good way.  Charley Thompson, a teenager living with his single father, gets a summer job working for horse trainer Del Montgomery. Bonding with an aging racehors.' as dummy
from perf_test
;

create index idx_tmp_pop on tmp(popularity);
create index idx_tmp_genres on tmp(genres);

analyze tmp;