import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import styles from "@/styles/Main.module.css"
import { Sidebar } from "@/components/card"
import Movie from "@/components/movie"
import Spinner from "@/components/spinner"
import { useRouter } from 'next/router'
import ControlPanel from "@/components/controlPanel"
import { NUM_MOVIES } from "@/util/constants"
import Head from 'next/head'

export const CallbackContext = createContext(null);

export default function Main({ }) {
  const router = useRouter()

  const [data, setData] = useState([])
  const [actorName, setActorName] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [moviePageVisible, setMoviePageVisible] = useState({ "visibility": "hidden" })
  const [searchPageVisible, setSearchPageVisible] = useState({ "visibility": "visible" })

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const [theme, setTheme] = useState('dark')

  const callbacks = useContext(CallbackContext)
  const { resetGenres, resetYear, resetMovie, resetActor,
    resetQuery, setYearstart, setYearend, setTitletype, setNumMovies,
    tconst, nconst, titletype, genres,
    query, yearstart, yearend, numMovies } = callbacks

  const snagActorName = (result) => {
    // Get selected actor name after we have some data.
    let found = false
    for (let i = 0; i < result.length && !found; i++) {
      const _nconst = result[i]["nconst"]
      if (nconst && nconst == _nconst) {
        const name = result[i]["primaryname"]
        setActorName(name)
        found = true
      }
    }
  }

  const getData = async () => {
    const url = `/api/get_movies?genres=${genres}&yearstart=${yearstart}&yearend=${yearend}&numMovies=${numMovies}&query=${query}&nconst=${nconst}&titletype=${titletype}`
    // console.log(url)

    setIsLoading(true)
    const response = await fetch(url)
    const result = await response.json()
    setIsLoading(false)

    setData(result)
    if (result && !query)
      snagActorName(result)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Enable the back button.
      window.addEventListener('popstate', function (event) {
        this.window.location.reload()
        event.preventDefault()
      })
    }
  }, [])

  useEffect(() => {
    if (tconst)
      setupMoviePage()
    else
      setupSearchPage()
  }, [tconst, nconst])

  useEffect(() => {
    //if (!nconst)
    setActorName('')

  }, [nconst])

  useEffect(() => {
    // console.log("useEffect, query:", _query, query)
    if (!router.isReady)
      return

    getData()



  }, [genres, numMovies, yearstart, yearend, query, nconst, titletype])

  if (!data) // || data.length == 0)
    return null

  const isBottom = (el) => {
    // console.log(`scrollTop:${el.scrollTop}, clientHeight:${el.clientHeight}, scrollHeight:${el.scrollHeight}`)
    return el.scrollTop + el.clientHeight + 1 > el.scrollHeight
  }

  const onScroll = (e) => {
    e.preventDefault()
    // return
    // console.log("onScroll")
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 100);

    const el = e.nativeEvent.srcElement
    if (isBottom(el)) {
      setNumMovies(numMovies + NUM_MOVIES)
    }
  }

  const setupSearchPage = () => {

    setSearchPageVisible({ "display": "block" })
    setMoviePageVisible({ "display": "none" })
  }

  const setupMoviePage = () => {
    setMoviePageVisible({ "display": "block" })
    // SearchPage will be hidden once the Movie page is ready.
    // hideSearchPage()
  }

  const hideSearchPage = () => {
    setSearchPageVisible({ "display": "none" })
  }

  const setNavUrl = () => {
    let navUrl = ''
    if (tconst) {
      navUrl = `/?tconst=${tconst}`
    } else {
      let params = []
      if (nconst) {
        params.push(`nconst=${nconst}`)
      }
      if (query && query != 'undefined') {
        params.push(`query=${query}`)
      }
      if (genres) {
        params.push(`genres=${genres}`)
      }
      if (yearstart) {
        params.push(`yearstart=${yearstart}`)
      }
      if (yearend) {
        params.push(`yearend=${yearend}`)
      }
      if (titletype) {
        params.push(`titletype=${titletype}`)
      }
      if (params.length > 0) {
        const p = params.join('&')
        navUrl = `/?${p}`
      }
    }
    if (typeof window !== 'undefined') {
      if (navUrl !== '/' + window.location.search) {
        window.history.pushState({}, '', navUrl)
      }

    }
  }

  const searchResultsHTML = (
    <div
      id="search_page"
      className={styles.search_page}
      style={{ ...searchPageVisible, "backgroundColor": theme == 'light' ? 'white' : 'black' }}
      onScroll={onScroll}
    >

      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=0.7, maximum-scale=10.0, minimum-scale=0.1, user-scalable=yes'
        />
      </Head>

      <ControlPanel
        setTheme={setTheme}
        theme={theme}
      />
      <Sidebar
        data={data}
        place='genres'
        selectedPerson={nconst}
        isScrolling={isScrolling}
        theme={theme}
      />
    </div>
  )

  const movieHTML = (
    <div
      className={styles.movie}
      style={moviePageVisible}
    >
      <Movie
        tconst={tconst}
        hideSearchPage={hideSearchPage}
      />
    </div>
  )

  setNavUrl()

  return <>
    <Spinner isLoading={isLoading} />
    {movieHTML}
    {searchResultsHTML}
  </>
}
