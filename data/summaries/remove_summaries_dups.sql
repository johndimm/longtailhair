with dups as (
    select
        tconst,
        count(*) as cnt
    from
        summaries
    where
        tconst is not null
        and tconst != ''
    group by
        1
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
        summaries
        join dups using (tconst)
    group by
        1
    order by
        1
)
delete from summaries as s
using max as m
where m.maxid = s.id
;

