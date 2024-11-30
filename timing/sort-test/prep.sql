drop table if exists tmp;
create table tmp (
    id serial primary key,
   -- tconst text,
    genres text,
    popularity integer,
    dummy text
);


--(like title_basics_ex including all);

-- insert into tmp
-- select tconst, genres_array, popularity, fulltext, actors_array

insert into tmp (genres, popularity, dummy)
select 
-- tconst, 
case when 
(string_to_array(genres, ','))[1]  in ('Drama') --, 'Adult') 
then (string_to_array(genres, ','))[1] 
else ''
end 
as genres, 
--case 
--when 
--(string_to_array(genres, ','))[1]  = 'Drama'
--then 
(RANDOM() * 27597536)::integer
--when 
--(string_to_array(genres, ','))[1]  = 'Adult'
--then (RANDOM() * 35535)::integer
--else  (RANDOM() * 27597536)::integer
--end
as popularity,

-- (RANDOM() * 27597536)::integer as popularity, 
-- popularity::integer, 

'They''re ordinary husband and wife realtors until she undergoes a dramatic change that sends them down a road of death and destruction. In a good way.  Charley Thompson, a teenager living with his single father, gets a summer job working for horse trainer Del Montgomery. Bonding with an aging racehors.' as dummy
from title_basics_ex
;
/*

tconst,
titletype,
primarytitle,
originaltitle,
isadult,
startyear,
endyear,
runtimeminutes,
genres,
genres_array,
averagerating,
numvotes,
popularity,
actors_array,


create table tmp as
-- select tconst, popularity
select *
from title_basics_ex
-- limit 1000000
;
*/

-- create index idx_tmp_pop on tmp(popularity);

/*

create index idx_tmp_tconst on tmp (tconst);
create index idx_tmp_year on tmp (startYear);
create index idx_tmp_titletype on tmp(titletype);
-- create index idx_tmp_pop on tmp(popularity);

create index idx_tmp_fulltext on tmp using GIN (fulltext);
create index idx_tmp_genres_array on tmp using GIN (genres_array);
create index idx_tmp_actors_array on tmp using GIN (actors_array);
*/


-- create index idx_tbe_pop on title_basics_ex(popularity);