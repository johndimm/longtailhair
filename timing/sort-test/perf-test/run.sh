psql -c "drop table if exists perf_test;"
psql -f perf_test_data.sql
psql -f prepare.sql
./query.sh
echo "again..."
./query.sh

#echo " ===>  without the dummy text column, still slow on aws"
#ech " ====>  but it's fast if you create the tmp table without dummy.  Bizarre."
#psql -c "alter table tmp drop column dummy;"
#./query.sh
