 with dups as (
select tconst, url, count(*) from posters group by 1,2 having count(*) > 1)
delete from posters as p
using dups
where dups.tconst = p.tconst;
