SET enable_seqscan = OFF;

explain 
SELECT unnest(genres_array) as genre, count(*) 
FROM title_basics_ex
WHERE (to_tsvector('english', genres) @@ (to_tsquery('english', 'Comedy')))
group by 1
;

alter table title_basics_ex 
add column genres_tsvector tsvector;

update title_basics_ex
set genres_tsvector = to_tsvector('english', genres);


alter table title_basics_ex
drop column genres_tsvector;


drop table if exists tb_gv;
create table tb_gv as (
    select tbe.*, to_tsvector('english', genres) as genres_tsvector
    from title_basics_ex as tbe
    -- limit 100000
);


explain 
SELECT unnest(genres_array) as genre, count(*) 
FROM tb_gv
WHERE genres_tsvector @@ (to_tsquery('english', 'Comedy'))
group by 1
;

create index idx_tbe_tsvector on tb_gv using gin (genres_tsvector);