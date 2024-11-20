-- tt15908664
with center as (
    select c.tconst, c.nconst, c.career_order, 'center' as place
    from careers as c
    where c.tconst='tt15908664'
    order by c.ordering
), _left as (
    select c.tconst, c.nconst, c.career_order, 'left' as place
    from center as m
    join careers as c using (nconst)
    where c.career_order = m.career_order - 1
), _right as (
    select c.tconst, c.nconst, c.career_order, 'right' as place
    from center as m
    join careers as c using (nconst)
    where c.career_order = m.career_order + 1
), _all as (
select * from center
union all
select * from _left
union all
select * from _right
)
-- select * from _all;

select *
  from _all
  --join process.title_basics_ex as tb using (tconst)
  --join process.name_basics_ex as nb using (nconst)
  --join process.title_principals_agg as tp using (tconst, nconst)
  left join process.title_ratings_ex as tr using (tconst)
  left join posters as p using(tconst)
  left join summaries as s using (tconst)
  left join tmdb using (tconst)
;
*/