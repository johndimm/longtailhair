./clean.sh
psql -c "drop schema if exists raw_data; create schema raw_data;"
./load.sh
psql -f index.sql
