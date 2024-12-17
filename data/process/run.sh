# env local_imdb_postgres
psql -c "drop schema if exists process; create schema process;"

psql -f title-basics-start.sql
psql -f title-principals-ex.sql
psql -f title-principals-agg.sql
psql -f title-basics-ex.sql
psql -f name-basics-ex.sql
psql -f genres.sql
psql -f full-genres.sql
psql -f careers.sql
psql -f functions.sql


