with c as (
    select
--        'Comedy,Drama,Thriller' as _genres
        'Comedy' as _genres

),
c2 as (
    select
        array_length(string_to_array(_genres, ','), 1) as num_genres,
        string_to_array(_genres, ',') as input_genres_array
    from
        c
),
matching_movies as (
    select
        distinct tconst
    from
        title_basics_ex,
        c2,c
    where

     --   genres = _genres
     -- position(_genres in genres) > 0
     genres like concat('%', _genres, '%')


    /*
        (
            num_genres < 1
            or position(input_genres_array[1] in genres) > 0
        )
        and (
            num_genres < 2
            or position (input_genres_array[2] in genres) > 0
        )
        and (
            num_genres < 3
            or position (input_genres_array[3] in genres) > 0
        )
    */
)
select
    genre,
    count(*)
from
    genres
    join matching_movies using (tconst)
group by
    1;