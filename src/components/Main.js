"use client"
import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import styles from "@/styles/Main.module.css"
import { Sidebar } from "@/components/Card"
import Movie from "@/components/Movie"
import Spinner from "@/components/Spinner"
import { useRouter } from 'next/router'
import Banner from "@/components/Banner"
import ControlPanel from "@/components/ControlPanel"

import { NUM_MOVIES } from "@/util/constants"
import Head from 'next/head'

export const CallbackContext = createContext(null);

export default function Main({ }) {
  const router = useRouter()

  const [data, setData] = useState([])
  // const [actorName, setActorName] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [moviePageVisible, setMoviePageVisible] = useState({ "visibility": "hidden" })
  const [searchPageVisible, setSearchPageVisible] = useState({ "visibility": "visible" })

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const [theme, setTheme] = useState('light')
  const [showControlPanel, setShowControlPanel] = useState(false)
  const [ratingsFilter, setRatingsFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('popularity desc')

  const callbacks = useContext(CallbackContext)
  const { setNumMovies,
    tconst, nconst, titletype, genres,
    query, yearstart, yearend, numMovies, user } = callbacks

  const getData = async () => {
    const user_id = user ? user.id : null
    const url = `/api/get_movies?genres=${genres}&yearstart=${yearstart}&yearend=${yearend}&numMovies=${numMovies}&query=${query}&nconst=${nconst}&titletype=${titletype}&orderBy=${sortOrder}&ratingsFilter=${ratingsFilter}&user_id=${user_id}`

    console.log(url)

    setIsLoading(true)
    const response = await fetch(url)
    const result = await response.json()
    setIsLoading(false)

    setData(result)
  }

  const setupSearchPage = () => {
    setSearchPageVisible({ "display": "block" })
    setMoviePageVisible({ "display": "none" })
  }

  const setupMoviePage = () => {
    setMoviePageVisible({ "display": "block" })
  }

  const hideSearchPage = () => {
    setSearchPageVisible({ "display": "none" })
  }

  useEffect(() => {
    console.log(" ===== initializing Main")

    if (typeof window !== 'undefined') {
      // Enable the back button.
      window.addEventListener('popstate', function (event) {
        this.window.location.reload()
        event.preventDefault()
      })
    }
  }, [])

  useEffect(() => {
    if (tconst) {
      hideSearchPage()
      setupMoviePage()
    }
    else
      setupSearchPage()
  }, [tconst, nconst])

  /*
  useEffect(() => {
    //if (!nconst)
    setActorName('')

  }, [nconst])
  */

  useEffect(() => {
    if (!router.isReady)
      return

    getData()
  }, [genres, numMovies, yearstart, yearend, query, nconst, titletype, ratingsFilter, sortOrder])

  const toggleShowControlPanel = () => {
    setShowControlPanel(!showControlPanel)
  }



  const isBottom = (el) => {
    return el.scrollTop + el.clientHeight + 1 > el.scrollHeight
  }

  const onScroll = (e) => {
    e.preventDefault()
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 5000);

    const el = e.nativeEvent.srcElement
    if (isBottom(el)) {
      setNumMovies(numMovies + NUM_MOVIES)
    }
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

  setNavUrl()

  if (!data)
    return null

  return <>
    <Spinner isLoading={isLoading} />
    <div
      className={styles.movie}
      style={moviePageVisible}
    >
      <Movie
        tconst={tconst}
        nconst={nconst}
        hideSearchPage={hideSearchPage}
      />
    </div>
    <div
      onScroll={onScroll}
      id="search_page"
      className={styles.search_page}
      style={{ ...searchPageVisible, "backgroundColor": theme == 'light' ? 'white' : 'black' }}

    >
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=0.7, maximum-scale=10.0, minimum-scale=0.1, user-scalable=yes'
        />
      </Head>

      <Banner
        showControlPanel={showControlPanel}
        toggleShowControlPanel={toggleShowControlPanel}
      />
      <ControlPanel
        setTheme={setTheme}
        theme={theme}
        setRatingsFilter={setRatingsFilter}
        setSortOrder={setSortOrder}
        toggleShowControlPanel={toggleShowControlPanel}
        sortOrder={sortOrder}
        ratingsFilter={ratingsFilter}
        showControlPanel={showControlPanel} />
      <Sidebar
        data={data}
        place='genres'
        selectedPerson={nconst}
        isScrolling={isScrolling}
        theme={theme}
        getData={getData}
      />

    </div>
  </>
}