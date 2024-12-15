
#title=Last%20Words
#date=2002

#tconst=tt3727572
#title="Present%20Time!"
#date=1997

title=Miss%20Mala
date=1954
medium=movie

url="https://api.themoviedb.org/3/search/${medium}?api_key=${TMDB_KEY}&query=${title}&date=${date}"

echo $url

curl $url  > t

cat t | python3 -m json.tool
