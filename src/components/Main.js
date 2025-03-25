"use client"
import React, { useState, useEffect, useRef, useContext } from 'react'
import styles from "@/styles/Main.module.css"
import Cards from "@/components/Cards"
import Movie from "@/components/Movie"
import Spinner from "@/components/Spinner"
import { useRouter } from 'next/router'
import Banner from "@/components/Banner"
import ControlPanel from "@/components/ControlPanel"
import { StateContext } from '@/components/State'

import { NUM_MOVIES } from "@/util/constants"
import Head from 'next/head'



const Main = ({ }) => {
  const router = useRouter()

  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [moviePageVisible, setMoviePageVisible] = useState({ "visibility": "visible" })
  const [searchPageVisible, setSearchPageVisible] = useState({ "visibility": "visible" })
  //const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const parameters = useContext(StateContext)
  const { tconst, nconst, numMovies, theme, showControlPanel} = parameters.values
  const { setNumMovies, setShowControlPanel } = parameters.setters
  const [cardDim, setCardDim] = useState(null)
  

  const getData = async () => {
    const url = '/api/get_movies?' + parameters.urlParams

    if (numMovies == 1)
      setIsLoading(true)
    const response = await fetch(url)
    const result = await response.json()
    if (numMovies == 1)
    setIsLoading(false)

    setData(result)
  }

  const setupSearchPage = () => {
    //  setSearchPageVisible({ "display": "block" })
    //  setMoviePageVisible({ "display": "none" })
  }

  const setupMoviePage = () => {
    //  setSearchPageVisible({ "display": "none" })
    //  setMoviePageVisible({ "display": "block" })
  }

  const hideSearchPage = () => {
    //   setSearchPageVisible({ "display": "none" })
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
    if (tconst) {
      // hideSearchPage()
      setupMoviePage()
    }
  }, [tconst])

  useEffect(() => {
    setupSearchPage()
  }, [nconst])

  useEffect(() => {
    if (!router.isReady)
      return

    getData()
  }, parameters.paramArray)

  //[genres, numMovies, yearstart, yearend, query, nconst, titletype, ratingsFilter, sortOrder])

  const toggleShowControlPanel = () => {
    setShowControlPanel(!showControlPanel)
  }

  const atBottom = (el) => {
    return el.scrollTop + el.clientHeight + 1 > el.scrollHeight
  }

  const onScroll = (e) => {
    // e.preventDefault()
    /*
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 5000);
    */

    const el = e.nativeEvent.srcElement
    if (atBottom(el) && numMovies != 1) {
      // if layout is one movie, don't try to show more.
      setNumMovies(numMovies + NUM_MOVIES)
    }
  }

  const navUrl = encodeURI(`/?${parameters.urlParams}`)
  if (typeof window !== 'undefined') {
    if (navUrl != '/' + window.location.search) {
      //console.log(navUrl)
      window.history.pushState({navUrl}, '', navUrl)
      //console.log(window.history.length)
    }
  }

  if (!data)
    return null

  let pageHtml
  if (tconst) {
    pageHtml = (
      <div
        className={styles.movie}
        style={moviePageVisible}
      >
        <Movie
          hideSearchPage={hideSearchPage}
          getData={getData}
        />
      </div>
    )
  } else {        
    pageHtml = (
      <div
        onScroll={onScroll}
        id="search_page"
        className={styles.search_page}
        style={{ ...searchPageVisible, "backgroundColor": theme == 'light' ? 'white' : 'black' }}
      >
        <Banner
          toggleShowControlPanel={toggleShowControlPanel}
        />
        <ControlPanel
          toggleShowControlPanel={toggleShowControlPanel}
          setCardDim={setCardDim}
          cardDim={cardDim}
        />
        <Cards
          data={data}
          place='genres'
          selectedPerson={nconst}
          theme={theme}
          getData={getData}
          cardDim={cardDim}
        />
      </div>
    )
  }


  return <>
    <Spinner isLoading={isLoading} />
    <Head>
      <meta
        name='viewport'
        content='width=device-width, initial-scale=0.6, user-scalable=yes'
      />
    </Head>
    {pageHtml}
  </>
}


export default Main