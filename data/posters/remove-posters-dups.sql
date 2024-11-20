with dups as (
    select
        tconst, -- url,
        count(*) as cnt
    from
        posters
    where
        tconst is not null
        and tconst != ''
    group by
        1 -- ,2
    having
        count(*) > 1
)
-- select * from dups;


, max as (
    SELECT
        tconst,
        max(id) as maxid -- ,
        --ROW_NUMBER() OVER(
        --    PARTITION BY tconst
        --    ORDER BY
        --        tconst
        --) AS row_num
    FROM
        posters
        join dups using (tconst)
    group by
        1
    order by
        1
)

/*
select *
from max
;
*/




delete from posters as s
using max as m
where m.maxid = s.id
;


