drop table if exists tmp;

create table tmp as with series as (
  select
    generate_series(1, 1000000) as id
),
genres as (
  select
    id,
    case
      when mod(id, 100) = 0 then 'Comedy'
      when mod(id, 100) < 25 then 'Drama'
      else null
    end as genres
  from
    series
)
select
  id,
  genres,
  case
    when genres = 'Comedy' then  (RANDOM() * 1000) :: integer
    when genres = 'Drama' then (RANDOM() * 10000000) :: integer
    else 0
  end as popularity,

  'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night''s Watch, is all that stands between the realms of men and icy horrors beyond.'::text as dummy
from
  genres;
;

/*


*/