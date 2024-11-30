# psql -f prep.sql
psql -f synth.sql
psql -f index.sql
./q.sh
echo "again..."
./q.sh

