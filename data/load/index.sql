set schema 'raw_data';
create index idx_tp_tconst on title_principals(tconst);
create index idx_tp_nconst on title_principals(nconst);

create index idx_tb_base_tconst on title_basics(tconst);
create index idx_nb_base_nconst on name_basics(nconst);

create index idx_tr_tconst on title_ratings(tconst);

-- create index idx_tb_base_primaryTitle on title_basics(primaryTitle);
-- create index idx_nb_base_primaryName on name_basics(primaryName);

-- create index idx_tb_base_titleType on title_basics(titleType);
