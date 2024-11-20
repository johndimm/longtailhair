pg_dump --table careers --schema-only > careers.sql
psql -c "\copy careers to 'careers.tsv' delimiter E'\t';"
pg_dump --table name_basics_ex --schema-only > name_basics_ex.sql
psql -c "\copy name_basics_ex to 'name_basics_ex.tsv' delimiter E'\t';"
pg_dump --table posters --schema-only > posters.sql
psql -c "\copy posters to 'posters.tsv' delimiter E'\t';"
pg_dump --table summaries --schema-only > summaries.sql
psql -c "\copy summaries to 'summaries.tsv' delimiter E'\t';"
pg_dump --table title_basics_ex --schema-only > title_basics_ex.sql
psql -c "\copy title_basics_ex to 'title_basics_ex.tsv' delimiter E'\t';"
pg_dump --table title_principals_agg --schema-only > title_principals_agg.sql
psql -c "\copy title_principals_agg to 'title_principals_agg.tsv' delimiter E'\t';"
pg_dump --table tmdb --schema-only > tmdb.sql
psql -c "\copy tmdb to 'tmdb.tsv' delimiter E'\t';"
