select count(*)
from title_basics_ex
where position('Drama' in genres) > 0
  and position('Comedy' in genres) > 0
;