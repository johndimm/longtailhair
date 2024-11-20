drop table if exists summaries;

create table summaries (
id integer primary key generated always as identity,
wiki_id text,
tconst text,
title text,
plot_summary text,
plot text
);

\copy summaries (wiki_id, tconst, title, plot_summary, plot) from dimm.plots.clean.tsv;

create index idx_summaries on summaries(tconst); 
