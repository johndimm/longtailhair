with c as (
    select
        'Drama' as _genres
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
        genres as g1
        -- join genres as g2 using (tconst)
        --join genres as g3 using (tconst)
        , c2
    where
        (
            num_genres < 1
            or g1.genre = input_genres_array[1]
        )
        /*
        
        and (
            num_genres < 2
            or g2.genre = input_genres_array[2]
        )
        and (
            num_genres < 3
            or g3.genre = input_genres_array[3]
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