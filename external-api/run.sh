psql -f tmdb-get-input.sql
python3 tmdb.py 
# cat tmdb.tsv

#psql -f create-tmdb.sql
psql -f load-tmdb.sql

# psql -c "select * from tmdb;" > tmdb.out
