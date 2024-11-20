--explain
select tb.tconst, tb.genres, tr.averageRating, tr.numVotes, tr.averageRating * tr.numVotes as popularity
from process.title_basics_ex as tb
join raw_data.title_ratings as tr using (tconst)
where 
  -- position('Comedy' in tb.genres) = 1 
  tb.genres = 'Drama'
order by tr.averageRating * tr.numVotes desc
limit 9
;
