drop table if exists tmp;
create table tmp (
    id serial primary key,
    gin_id int
);

insert into tmp (gin_id)
select id from gin
where genres_array @> string_to_array('Sci-Fi', ',')
limit 300
;

-- group by 1


select * 
from gin join tmp on tmp.gin_id = gin.id
order by gin.id
limit 24
;
