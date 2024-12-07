drop table if exists tmp;
create table tmp as
select tconst, genres_array, popularity, -- fulltext, actors_array
'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night''s Watch, is all that stands between the realms of men and icy horrors beyond.'::text as dummy
from title_basics_ex;

