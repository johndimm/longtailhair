# psql -f prep.sql
#psql -f prep-array.sql
psql -f synth-mod.sql

psql -f index-array.sql
./q-array.sh
echo "again..."
./q-array.sh

