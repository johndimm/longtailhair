select tb.tconst, tb.genres, averageRating, numVotes, averageRating * numVotes as popularity
from process.title_basics_ex as tb
join raw_data.title_ratings as tr using (tconst)
where tb.genres = 'Crime,Horror'
order by averageRating * numVotes desc
;


