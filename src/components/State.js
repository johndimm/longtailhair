//'use client';
import React, { useEffect, useState, createContext } from 'react'

import Main from "@/components/Main"
import { useRouter } from 'next/router'
import { NUM_MOVIES, MIN_YEAR, MAX_YEAR } from "@/util/constants"

export const StateContext = createContext(null);

const State = () => {
  const router = useRouter()

  const [_genres, setGenres] = useState()
  const [_yearstart, setYearstart] = useState(MIN_YEAR)
  const [_yearend, setYearend] = useState(MAX_YEAR)
  const [_query, setQuery] = useState('undefined')
  const [_tconst, setMovie] = useState()
  const [_nconst, setActor] = useState()
  const [_titletype, setTitletype] = useState(null)
  const [_numMovies, setNumMovies] = useState(NUM_MOVIES)
  const [_ratingsFilter, setRatingsFilter] = useState('all')
  const [_sortOrder, setSortOrder] = useState('popularity desc')
  const [_theme, setTheme] = useState('light')
  const [_showControlPanel, setShowControlPanel] = useState(false)
  const [_aiModel, setAIModel] = useState('Gemini')
  // const [_user, setUser] = useState({ id: 725, email: null, name: 'Vince' })
  const [_user, setUser] = useState({ id: null, email: null, name: null })

  const [numRatings, setNumRatings] = useState(0)
  const [paramsProcessed, setParamsProcessed] = useState(false)
  const [cardDim, setCardDim] = useState()

  const { tconst, nconst, genres, year, yearstart, yearend,
    query, titletype, numMovies, page, ratingsFilter, sortOrder,
    theme, showControlPanel, aiModel
  } = router.query


  useEffect(() => {
    if (router.isReady) {
      setMovie(tconst)
      setActor(nconst)
      setGenres(genres)
      setYearstart(yearstart || year || _yearstart)
      setYearend(yearend || year || _yearend)
      setQuery(query)
      setTitletype(titletype)
      setParamsProcessed(true)
      setNumMovies(parseInt(numMovies) || NUM_MOVIES)
      setRatingsFilter(ratingsFilter || _ratingsFilter)
      setSortOrder(sortOrder || _sortOrder)
      setTheme(theme || _theme)
      setShowControlPanel(showControlPanel == 'true' || _showControlPanel)
      setAIModel(aiModel || _aiModel)
    }
  }, [tconst, nconst, genres, year, yearstart, yearend,
    query, titletype, numMovies, page, ratingsFilter, sortOrder,
    theme, showControlPanel, aiModel])

  if (!router.isReady || !paramsProcessed) {
    return null
  }

  const resetGenres = (genres) => {
    //resetNumMovies()
    //setMovie(null)
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

  const resetAll = () => {
    resetGenres()
    resetYearstart(MIN_YEAR)
    resetYearend(MAX_YEAR)
    resetMovie()
    resetActor()
    resetQuery(null)
    setNumMovies(NUM_MOVIES)
    const queryInput = document.getElementById("query")
    queryInput.value = ''
  }

  const values = {
    tconst: _tconst,
    nconst: _nconst,
    genres: _genres,
    yearstart: _yearstart,
    yearend: _yearend,
    query: _query,
    titletype: _titletype,
    numMovies: _numMovies,
    ratingsFilter: _ratingsFilter,
    sortOrder: _sortOrder,
    user_id: _user.id,
    theme: _theme,
    showControlPanel: _showControlPanel,
    aiModel: _aiModel, 
    cardDim: cardDim,
    numRatings: numRatings
  }

  // Get new data if any of these change.  The tconst value is not included here.  
  // It just selects the movie and doesn't change the set of movies.
  const paramArray = [
    _nconst, _genres, _numMovies, _yearstart, _yearend, _query,
    _titletype, _ratingsFilter, _sortOrder, _theme, _aiModel, _user.id
  ]

  const genresParamArray = [_genres, _query, _yearstart, _yearend,
    _nconst, _titletype, _ratingsFilter, _user.id]

  // Create the key=value params to use in a url.
  const params = []
  Object.keys(values).map((name, idx) => {
    const val = values[name]
    if (val != undefined && val != '')
      params.push(`${name}=${val}`)
  })
  const urlParams = params.join('&')

  const setters = {
    resetGenres: resetGenres,
    resetYear: resetYear,
    resetYearstart: resetYearstart,
    resetYearend: resetYearend,
    resetQuery: resetQuery,
    resetMovie: resetMovie,
    resetActor: resetActor,
    setTitletype: setTitletype,
    setNumMovies: setNumMovies,
    setUser: setUser,
    setCardDim: setCardDim,
    setRatingsFilter: setRatingsFilter,
    setSortOrder: setSortOrder,
    setTheme: setTheme,
    setShowControlPanel: setShowControlPanel,
    setAIModel: setAIModel,
    resetAll: resetAll,
    setNumRatings: setNumRatings
  }

  const parameters = {
    user: _user,
    setters: setters,
    values: values,
    urlParams: urlParams,
    paramArray: paramArray,
    genresParamArray: genresParamArray
  }

  return (
    <StateContext.Provider value={parameters}>
      <Main />
    </StateContext.Provider >
  )
}

export default State
