-- explain
SELECT id,
       popularity
FROM   tmp
WHERE  genres = 'Comedy'
ORDER  BY 2 DESC
LIMIT  24; 