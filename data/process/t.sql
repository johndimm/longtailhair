with params as (
    select 'movie' as _titletype
), exploded as (
    select tb.tconst, ur.rating as user_rating
    from  title_basics_ex as tb
    join full_genres as fg using(genres)
    left join user_ratings as ur using (tconst),
    params
where

 (_titletype is null or (_titletype = 'movie' and tb.titletype = 'movie') or (_titletype != 'movie' and tb.titletype != 'movie'))
-- and
-- (_rating_filter != 'not rated' or ur.rating is null)

    limit 100
)
select *
from exploded as e
join title_basics_ex as tb using (tconst)
join title_principals_agg as tp using (tconst)
join name_basics_ex as nb using (nconst)
left join tmdb using (tconst)
left join posters as p on p.tconst = e.tconst and p.error_count < 1

where e.user_rating is null
;