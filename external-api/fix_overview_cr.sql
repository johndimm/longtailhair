select count(*) from tmdb where overview like e'%\n%';

update tmdb set overview = replace(overview, e'\n', ' ') where overview like e'%\n%';
