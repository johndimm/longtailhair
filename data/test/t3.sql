with center as (
    select c.tconst, c.nconst, c.career_order, 'center' as place
    from careers as c
    where c.tconst='tt0356910'
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
select center.*, nb.primaryName, tb.primaryTitle
  from center
  join raw_data.title_basics as tb using (tconst)
  join raw_data.name_basics as nb using (nconst)
  join title_principals_agg as tp using (tconst, nconst)
  join raw_data.title_ratings as tr using (tconst)
  -- left join posters as p using(tconst)
  left join summaries as s using (tconst)
where center.nconst = 'nm0000093'
;
