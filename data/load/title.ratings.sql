set search_path to 'raw_data';
drop table if exists title_ratings;

create table title_ratings (
tconst text, --(string) - alphanumeric unique identifier of the title
averageRating float, -- weighted average of all the individual user ratings
numVotes int -- number of votes the title has received
);

\copy title_ratings from 'title.ratings.clean.tsv' with delimiter E'\t' csv header null as '\N';

