with dups as (
select tconst, count(*) from tmdb group by 1 having count(*) > 1
)
delete from tmdb
using dups 
where dups.tconst = tmdb.tconst
;
