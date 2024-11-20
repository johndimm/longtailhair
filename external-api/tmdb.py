import requests
import json
import time
import re

def get (outfile, imdb_id, results_type):
  url = f'https://api.themoviedb.org/3/find/{imdb_id}'
  key='971aac97e5d05d2228225f45a6ad279a'

  params = {
        'api_key': key, 
        'language': 'en-US', 
        'external_source': 'imdb_id'
  } 

  response = requests.get (url, params)
  # print (response.content)
  j = json.loads(response.content)

  res = j[results_type]
  if res and len(res) > 0:

    movie = res[0]
    print ('movie', json.dumps(movie, indent=2))

    poster_path = movie["poster_path"]
    #poster_path = movie["profile_path"]

    backdrop_path = movie.get("backdrop_path", None)
    overview = movie.get("overview", '')
    width=200
    url_prefix = f'https://image.tmdb.org/t/p/w{width}'

    tmdb_id = movie.get("id", -1)

    print (imdb_id)

    pp = url_prefix + poster_path if poster_path is not None else ''
    bp = url_prefix + backdrop_path if backdrop_path is not None else ''

    overview_cleaned = re.sub(r"[\n\r]", " ", overview) #overview.replace("\n", " ")

    print (f"{imdb_id}\t{tmdb_id}\t{pp}\t{bp}\t{overview_cleaned}", file=outfile)
  else:
    tmdb_id = -1
    pp = ''
    bp = ''
    overview_cleaned = ''
    print (f"{imdb_id}\t{tmdb_id}\t{pp}\t{bp}\t{overview_cleaned}", file=outfile)



def main():
  f = open ('titles.tsv')
  outfile = open ('tmdb.tsv', 'w')
  for r in f:
    r = r.strip()
    #get(outfile, r, 'person_results')
    get(outfile, r, 'movie_results') 
    #get(outfile, r, 'tv_results') 

    time.sleep(1)
  outfile.close()
  f.close()

main()

#get('tt0356910')
#get('nm0000093')