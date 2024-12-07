-- explain
SELECT tconst,
       popularity
FROM   tmp
WHERE  genres_array @> string_to_array('Adult'::text, ',') 
ORDER  BY 2 DESC
LIMIT  24; 