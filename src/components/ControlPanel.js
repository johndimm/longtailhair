import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import { CallbackContext } from '@/components/Main'
import Actor from "@/components/Actor"
import YearPicker from "@/components/YearPicker"
import Genres from "@/components/Genres"
import styles from "@/styles/ControlPanel.module.css"
import { NUM_MOVIES, MIN_YEAR, MAX_YEAR } from "@/util/constants"


const SearchForm = ({ query, resetQuery }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newQuery = formData.get('query');
    resetQuery(newQuery)
  };

  const handleClear = (e) => {
    if (e.target.value === '') {
      resetQuery(null)
    }
  }

  return (
    <form className={styles.search_form} onSubmit={handleSubmit}>
      <input
        id="query"
        name="query"
        className={styles.search_input}
        type="search"
        defaultValue={query != 'undefined' ? query : null}
        placeholder='title, cast, crew'
        onInput={handleClear}
      />
      <button type="submit" className={styles.magnifying_glass}>
        &#128269;
      </button>
    </form>
  );
};


const MovieTVSwitch = ({ titletype, setTitletype }) => {

  const Radio = ({ type }) => {
    return (
      <label>
        <input
          name='titletype'
          type="radio"
          defaultChecked={titletype == type}
          onChange={
            (e) => {
              if (e.target.checked) setTitletype(type)
            }
          } />
        {type}
      </label>
    )
  }

  return (
    <div className={styles.movie_tv_switch}>
      <Radio type='movie' />
      <br />
      <Radio type='tv' />
    </div>
  )
}

const ThemeSwitch = ({ theme, setTheme }) => {
  return (
    <div className={styles.theme_switch}>
      <input id="light-theme" type="radio" checked={theme == 'light'} onChange={() => setTheme(theme == 'light' ? 'dark' : 'light')} />
      <label htmlFor="light-theme">light</label>
      <br />
      <input id="dark-theme" type="radio" checked={theme == 'dark'} onChange={() => setTheme(theme == 'dark' ? 'light' : 'dark')} />
      <label htmlFor="dark-theme">dark</label>
    </div>
  )
}

const ControlPanel = ({ actorName, setTheme, theme }) => {

  const callbacks = useContext(CallbackContext)
  const { resetGenres, resetMovie, resetActor,
    resetQuery, resetYearstart, resetYearend, setTitletype, setNumMovies,
    nconst, titletype, genres,
    query, yearstart, yearend, setCardDim } = callbacks

  const updateDates = (yearstart, yearend) => {
    resetYearstart(yearstart)
    resetYearend(yearend)
  }

  const goLeft = (e) => {
    if (!yearstart || !yearend)
      return

    const delta = Math.max(yearend - yearstart, 0)
    updateDates(parseInt(yearstart) - delta - 1, parseInt(yearstart) - 1)
  }

  const goRight = (e) => {
    if (!yearstart || !yearend)
      return

    const delta = Math.max(yearend - yearstart, 0)
    updateDates(parseInt(yearend) + 1, parseInt(yearend) + 1 + delta)
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
      <a href="https://github.com/johndimm/longtailhair/blob/main/README.md">
        <img className={styles.logo2} src="github.jpg" />
      </a>
      <a href="https://github.com/johndimm/longtailhair/blob/main/README.md">
        <img className={styles.logo2} src="omdb.png" />
      </a>
    </div>
  )

  const zoom = theme == 'dark'
    ? <div className={styles.card_dim_slider} >zoom
      <input type="range"
        min="150" max="600"
        defaultValue="310"
        onChange={newCardDim} />
    </div>
    : <></>


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
        <a href='/About' title='About this app...'>
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

      {zoom}

      <MovieTVSwitch titletype={titletype} setTitletype={setTitletype} />
      <ThemeSwitch theme={theme} setTheme={setTheme} />

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