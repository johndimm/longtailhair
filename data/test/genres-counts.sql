/*
 -- select regexp_replace(genres::text, ',[^,]*$', ''), count(*)
 select regexp_replace(genres::text, ',.*$', '') -- , count(*)
 from process.title_basics_ex
 group by 1;
 */


 /*
with extract as (
    select
        tconst,
        genres,
        startYear,
        array_remove (
          array_remove (string_to_array(genres,','), 'Biography')
          , 'Comedy'
        ) 
        as genres_left
    from
        process.title_basics_ex
    where
        'Biography' = ANY(string_to_array(genres, ','))
        and 
        'Comedy' = ANY(string_to_array(genres, ','))
        -- and startYear in ('1976', '1977')
)
select
    genres_left[1],
    -- startyear,
    count(*)
from
    extract
group by
    1
order by 
    1 
    ;

*/

with exploded as (
select tconst, unnest(string_to_array(genres,',')) as genre
from process.title_basics_ex
where 
  string_to_array(genres, ',') @> string_to_array('Drama', ',')
   and startyear between '1970' and '1980'
)
select *
from exploded
order by 1
;
/*
select genre, count(*)
from exploded
group by 1
;
*/