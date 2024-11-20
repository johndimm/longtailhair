insert into posters (tconst, url)
select po2.tconst, po2.url 
from po2
left join posters using (tconst)
where posters.tconst is null
;

