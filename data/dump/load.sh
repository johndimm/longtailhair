echo $DATABASE_URL
psql $DATABASE_URL -f careers.sql
psql $DATABASE_URL -c "\copy careers from 'careers.tsv' delimiter E'\t';"
psql $DATABASE_URL -f name_basics_ex.sql
psql $DATABASE_URL -c "\copy name_basics_ex from 'name_basics_ex.tsv' delimiter E'\t';"
psql $DATABASE_URL -f posters.sql
psql $DATABASE_URL -c "\copy posters from 'posters.tsv' delimiter E'\t';"
psql $DATABASE_URL -f summaries.sql
psql $DATABASE_URL -c "\copy summaries from 'summaries.tsv' delimiter E'\t';"
psql $DATABASE_URL -f title_basics_ex.sql
psql $DATABASE_URL -c "\copy title_basics_ex from 'title_basics_ex.tsv' delimiter E'\t';"
psql $DATABASE_URL -f title_principals_agg.sql
psql $DATABASE_URL -c "\copy title_principals_agg from 'title_principals_agg.tsv' delimiter E'\t';"
psql $DATABASE_URL -f tmdb.sql
psql $DATABASE_URL -c "\copy tmdb from 'tmdb.tsv' delimiter E'\t';"
