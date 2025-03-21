delete from user_ratings where user_id=177 and rating=-3
;

/*
insert into user_ratings
(source_order, tconst, rating, user_id)
select 49, 'tt1234', -3, 177
;
*/


insert into user_ratings
  (source_order, user_id, tconst, rating, msg)
  select 
    source_order,
    177 as user_id, 
    tbe.tconst, 
    -3, 
    why_recommended as msg
  from tmp
  join title_basics_ex as tbe on 
  lower(tbe.primarytitle) = lower(tmp.title) 
  and startyear = tmp.year 
  on conflict (user_id, tconst) do nothing
  ;


select ur.user_id, tbe.primarytitle, ur.tconst, rating, source_order 
from user_ratings as ur
join title_basics_ex as tbe using (tconst)
where user_id=177 and rating=-3
order by source_order;
