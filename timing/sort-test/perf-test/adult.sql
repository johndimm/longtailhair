explain
SELECT id,
       popularity
FROM   tmp
WHERE  genres = 'Adult'
ORDER  BY 2 DESC
LIMIT  24; 
