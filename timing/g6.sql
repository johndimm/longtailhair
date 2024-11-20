SELECT genre, COUNT(*)
FROM (
    SELECT unnest(genres_array) AS genre
    FROM title_basics_ex
) subquery
GROUP BY genre;
