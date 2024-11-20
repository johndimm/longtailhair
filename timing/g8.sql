\pset pager 0

SELECT tconst
FROM title_basics_ex
WHERE genres_array && ARRAY['Drama', 'Comedy'];