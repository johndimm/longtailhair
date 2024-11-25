//'use client';
import { useEffect, useState } from 'react'

import Main from "@/components/Main"
import { useRouter } from 'next/router'
import { CallbackContext } from '@/components/Main'
import { NUM_MOVIES } from "@/util/constants"

export default function Index() {
  const router = useRouter()

  const [_genres, setGenres] = useState()
  const [_yearstart, setYearstart] = useState()
  const [_yearend, setYearend] = useState()
  const [_query, setQuery] = useState('undefined')
  const [_tconst, setMovie] = useState()
  const [_nconst, setActor] = useState()
  const [_titletype, setTitletype] = useState('movie')
  const [_numMovies, setNumMovies] = useState(NUM_MOVIES)
  const [paramsProcessed, setParamsProcessed] = useState(false)

  const { tconst, nconst, genres, year, yearstart, yearend, query, titletype, numMovies } = router.query

  useEffect(() => {
    if (router.isReady) {
      setMovie(tconst)
      setActor(nconst)
      setGenres(genres)
      setYearstart(yearstart || year)
      setYearend(yearend || year)
      setQuery(query)
      setTitletype(titletype || 'movie')
      setParamsProcessed(true)
      setNumMovies(_numMovies || NUM_MOVIES)
    }
  }, [tconst, nconst, genres, year, yearstart, yearend, query, titletype])

  if (!router.isReady || !paramsProcessed) {
    return null
  }

  const resetGenres = (genres) => {
    resetNumMovies()
    setMovie(null)
    setGenres(genres)
  }

  const resetYear = (year) => {
    resetNumMovies()
    resetMovie(null)
    setYearstart(year)
    setYearend(year)
  }

  const resetMovie = (tconst) => {
    setMovie(tconst)
  }

  const resetQuery = (query) => {
    setMovie(null)
    resetNumMovies()
    setQuery(query)
  }

  const resetYearstart = (yearstart) => {
    resetNumMovies()
    setYearstart(yearstart)
  }

  const resetYearend = (yearend) => {
    resetNumMovies()
    setYearend(yearend)
  }

  const resetActor = (nconst) => {

    console.log('resetActor', nconst)
    
    const newNconst = _nconst == nconst
      ? null
      : nconst

    setMovie(null)
    resetNumMovies()
    setActor(newNconst)

    if (newNconst) {
      setQuery(null)
      setGenres(null)
      setYearstart(null)
      setYearend(null)
    }
  }

  const resetNumMovies = () => {
    setNumMovies(NUM_MOVIES)
  }

  const callbacks = {
    resetGenres: resetGenres,
    resetYear: resetYear,
    resetYearstart: resetYearstart,
    resetYearend: resetYearend,
    resetQuery: resetQuery,
    resetMovie: resetMovie,
    resetActor: resetActor,
    setTitletype: setTitletype,
    setNumMovies: setNumMovies,
    resetNumMovies: resetNumMovies,
    tconst: _tconst,
    nconst: _nconst,
    genres: _genres,
    yearstart: _yearstart,
    yearend: _yearend,
    query: _query,
    titletype: _titletype,
    numMovies: _numMovies
  }

  return <CallbackContext.Provider value={callbacks}>
    <Main />
  </CallbackContext.Provider >
}
