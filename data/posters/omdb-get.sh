TCONST=$1
URL=http://localhost:3000/api/get_omdb?tconst=${TCONST}
echo $URL
curl $URL
sleep 1
