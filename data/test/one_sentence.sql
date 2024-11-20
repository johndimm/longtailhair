\x
select 
  plot_summary, substring(plot_summary, 0, 1 + position('.' in plot_summary)) as one_sentence
from summaries
where plot_summary is not null and plot_summary != ''
limit 10;
  
