create table title_basics_ex_movies as
select *
from title_basics_ex
where titletype='movie'
;

select count(*) from title_basics_ex;
select count(*) from title_basics_ex_movies;
