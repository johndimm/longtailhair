-- explain
SELECT id,
       popularity
FROM   tmp
WHERE  genres = 'Drama'
ORDER  BY 2 DESC
LIMIT  24; 