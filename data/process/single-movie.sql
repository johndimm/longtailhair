set schema 'process';

drop table if exists single_movie;
create table single_movie as

with center as (
    select tconst, nconst, career_order, 'center' as place
    from careers
    where tconst='tt0071360'
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
select _all.*, nb.primaryName, tb.primaryTitle, coalesce(tp.characters, tp.category) as role, tb.startYear
  from _all
  join raw_data.title_basics as tb using (tconst)
  join raw_data.name_basics as nb using (nconst)
  join raw_data.title_principals as tp using (tconst, nconst)
;

\d single_movie