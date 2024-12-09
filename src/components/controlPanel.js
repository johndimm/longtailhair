import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import { CallbackContext } from '@/components/Main'
import Actor from "@/components/actor"
import YearPicker from "@/components/yearPicker"
import Genres from "@/components/genres"
import styles from "@/styles/ControlPanel.module.css"
import { NUM_MOVIES, MIN_YEAR, MAX_YEAR } from "@/util/constants"


const SearchForm = ({ query, resetQuery }) => {

  useEffect(() => {
    document.getElementById("query").addEventListener("search", function (event) {
      event.preventDefault();
      const query = event.currentTarget.value
      resetQuery(query)
    });
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    //const formData = new FormData(e.target); // Get form data from the event
    //const newQuery = formData.get('query');
    //resetQuery(newQuery) // Retrieve value from the field named 'inputField'
    // alert(`Submitted: ${inputValue}`);
  };



  return (

    <form
      onSubmit={handleSubmit}
      className={styles.search_form}
    >

      <input
        id="query"
        name="query"
        className={styles.search_input}
        type="search"
        defaultValue={query != 'undefined' ? query : null}
        placeholder='title, cast, crew' />


      <button type="submit" className={styles.magnifying_glass}>
        &#128269;
      </button>

    </form>
  );
};


const ControlPanel = ({ actorName, setTheme, theme }) => {

  const callbacks = useContext(CallbackContext)
  const { resetGenres, resetYear, resetMovie, resetActor,
    resetQuery, resetYearstart, resetYearend, setTitletype, setNumMovies,
    tconst, nconst, titletype, genres,
    query, yearstart, yearend, numMovies, setCardDim } = callbacks

  const updateDates = (yearstart, yearend) => {
    resetYearstart(yearstart)
    resetYearend(yearend)
  }

  const goLeft = (e) => {
    if (!yearstart || !yearend)
      return

    const delta = Math.max(yearend - yearstart, 1)
    updateDates(parseInt(yearstart) - delta, parseInt(yearend) - delta)
  }

  const goRight = (e) => {
    if (!yearstart || !yearend)
      return

    const delta = Math.max(yearend - yearstart, 1)
    updateDates(parseInt(yearstart) + delta, parseInt(yearend) + delta)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      const text = event.target.value
      resetQuery(text)
      setNumMovies(NUM_MOVIES)
      event.preventDefault();
    }
  }

  const handleOnChange = (e) => {
    const value = e.target.value
    if (value == '')
      resetQuery(null)
  }

  const newCardDim = (e) => {
    const val = e.target.value
    const width = parseInt(val)
    const height = width * 450 / 310
    const style = { width: width + 'px', height: height + 'px' }
    setCardDim(style)
  }
  const credits = (
    <div className={styles.credits}>
      <a href="https://developer.imdb.com/non-commercial-datasets/">
        <img className={styles.logo} src="imdb.jpg" />
      </a>
      &nbsp;
      <a href="https://developer.themoviedb.org/reference/intro/getting-started">
        <img className={styles.logo} src="tmdb.png" />
      </a>
      &nbsp;
      <a href="https://aws.amazon.com/rds/postgresql/">
        <img className={styles.logo} src="amazon-rds.png" />
      </a>
      <br />
      <a href="https://vercel.com/john-dimms-projects">
        <img className={styles.logo2} src="vercel.jpg" />
      </a>
      &nbsp;
      <a href="https://github.com/johndimm/longtail/blob/main/README.md">
        <img className={styles.logo2} src="github.jpg" />
      </a>
    </div>
  )

  const bigSmall = theme == 'dark'
    ? <>small
      <input className={styles.card_dim_slider} type="range"
        min="150" max="600"
        defaultValue="310"
        onChange={newCardDim} />
      big
    </>
    : <></>


  const resetAll = () => {
    resetGenres()
    resetYearstart(MIN_YEAR)
    resetYearend(MAX_YEAR)
    resetMovie()
    resetActor()
    resetQuery(null)
    // setTitletype('movie')
    setNumMovies(NUM_MOVIES)
    const queryInput = document.getElementById("query")
    queryInput.value = ''
  }

  const actorWidget = (
    <div className={styles.widget}>
      <Actor nconst={nconst}
        actorName={actorName}
        resetActor={resetActor}
      />
    </div>
  )

  const creditsWidget = (
    <div className={styles.widget}>
      <div className={styles.page_title}>
        <a href='/Demo'>
          Long Tail
          <div style={{ fontFamily: 'Arial', fontSize: "10pt", fontWeight: "100" }}>with</div>
          <div style={{ fontSize: "12pt" }}>Collaborations</div>
        </a>
      </div>

      {credits}
    </div>
  )

  const genresWidget = (
    <div className={styles.genres_widget}>
      <Genres
        genres={genres}
        query={query}
        yearstart={yearstart}
        yearend={yearend}
        nconst={nconst}
        titletype={titletype}
      />
    </div>
  )

  const dateWidget = (
    <div className={styles.date_widget}>

      <SearchForm query={query} resetQuery={resetQuery} />

      <div className={styles.movie_tv_switch}>
        <label>
          <input
            name='titletype'
            type="radio"
            defaultChecked={titletype == 'movie'}
            onChange={
              (e) => {
                if (e.target.checked) setTitletype('movie')
              }
            } />
          movies
        </label>
        &nbsp;
        <label>
          <input name='titletype' type="radio"
            defaultChecked={titletype == 'tvSeries'}
            onChange={
              (e) => {
                if (e.target.checked) setTitletype('tvSeries')
              }
            } />
          tv
        </label>
      </div>

      <div>
        <input id="light-theme" type="radio" checked={theme == 'light'} onChange={() => setTheme(theme == 'light' ? 'dark' : 'light')} />
        <label htmlFor="light-theme">light</label>
        &nbsp;
        <input id="dark-theme" type="radio" checked={theme == 'dark'} onChange={() => setTheme(theme == 'dark' ? 'light' : 'dark')} />
        <label htmlFor="dark-theme">dark</label>
      </div>

      {bigSmall}

      <YearPicker
        setParentYearstart={resetYearstart}
        setParentYearend={resetYearend}
        goLeft={goLeft}
        goRight={goRight}
        yearstart={yearstart}
        yearend={yearend} />


      <button className={styles.resetButton} onClick={resetAll}>reset</button>
      <br />
    </div>
  )

  return (
    <div className={styles.controls}>
      {actorWidget}
      {creditsWidget}
      {genresWidget}
      {dateWidget}
    </div>
  )
}

export default ControlPanel