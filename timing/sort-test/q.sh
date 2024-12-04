#psql -c "select count(*) from tmp"

#time psql -f gm-drama.sql > /dev/null
#time psql -f gm-adult.sql > /dev/null

psql -c "\d tmp"
psql -c "select genres, count(*) from tmp group by 1"
time psql -f sm2.sql 

#time psql -f query-drama.sql > /dev/null
#time psql -f query-adult.sql > /dev/null
#time psql -f query.sql > /dev/null

