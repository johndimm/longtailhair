drop table if exists tmp;
drop sequence if exists myseq;
create sequence myseq;

create table tmp as with series as (
  select
    generate_series(1, 1000000) as id
),
genres_arrays as (
  select
    nextval('myseq') as id,
    genres_array, 
    popularity
  from title_basics_ex
),
genres as (
  select
    s.id,
    genres_array as real_genres_array,
    case
      when mod(s.id, 100) = 0 then string_to_array('Adult'::text, ',')
      when mod(s.id, 100) < 25 then string_to_array('Drama'::text, ',')
      else null
    end as fake_genres_array,
    popularity::integer as real_popularity,
    (RANDOM() * 8000000) :: integer as fake_popularity
  from
    series as s
    join genres_arrays as ga on s.id = ga.id
)
select
  id as tconst,
  real_genres_array as genres_array,
  real_popularity as popularity ,
  'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night''s Watch, is all that stands between the realms of men and icy horrors beyond.'::text as dummy,
  'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night''s Watch, is all that stands between the realms of men and icy horrors beyond.'::text as dummy2,
  'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night''s Watch, is all that stands between the realms of men and icy horrors beyond.'::text as dummy3,
  'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night''s Watch, is all that stands between the realms of men and icy horrors beyond.'::text as dummy4



from
  genres;
;

-- \copy tmp to 'tmp.csv' with csv header delimiter ',';

/*


*/