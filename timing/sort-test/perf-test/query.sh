
psql -c "\d tmp"
#psql -c "select genres, count(*) from tmp group by 1"

echo "select Drama and it's fast everywhere"
time psql -f drama.sql > /dev/null

echo "select Adult and it's fast locally, but 50 seconds on aws."
time psql -f adult.sql > /dev/null



