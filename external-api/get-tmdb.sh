tconst=tt0052357


curl "https://api.themoviedb.org/3/find/${tconst}?api_key=${TMDB_KEY}&external_source=imdb_id" > t

cat t | python3 -m json.tool

