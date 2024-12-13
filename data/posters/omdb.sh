psql -f omdb.sql | sed "1,2d" > omdb-download.sh
#psql -f poster-not-omdb.sql | sed "1,2d" > omdb-download.sh
chmod a+x *.sh
time ./omdb-download.sh > /dev/null

