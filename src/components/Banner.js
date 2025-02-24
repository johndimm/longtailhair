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



const Banner = ({ actorName, setTheme, theme, showControlPanel, toggleShowControlPanel }) => {

  const callbacks = useContext(CallbackContext)
  const { resetGenres, resetMovie, resetActor,
    resetQuery, resetYearstart, resetYearend, setTitletype, setNumMovies,
    nconst, titletype, genres,
    query, yearstart, yearend, setCardDim } = callbacks
  //const [showGenres, setShowGenres] = useState(false)

  //useEffect(() => {
  //  setShowGenres(false)
  //}, [genres])

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
    const height = width * 480 / 310
    const style = { width: width + 'px', height: height + 'px' }
    setCardDim(style)
  }

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

  const logoWidget = (
    <div className={styles.widget}>
      <div className={styles.page_title}>
        <a href='/About' title='About this app...'>
          Long Tail
          <div style={{ fontFamily: 'Arial', fontSize: "10pt", fontWeight: "100" }}>with</div>
          <div style={{ fontSize: "12pt" }}>Collaborations</div>
        </a>
      </div>
    </div>
  )


  const searchWidget = (
    <div className={styles.search_widget}>
      <SearchForm query={query} resetQuery={resetQuery} />
      {zoom}
    </div>
  )

  const gearStyle = showControlPanel
    ? styles.gear_clicked
    : styles.gear

  return (
    <div className={styles.banner}>
      {actorWidget}
      {logoWidget}
      <div className={styles.widget}>
        <span className={gearStyle} onClick={toggleShowControlPanel}>&#x2699;</span>
      </div>
      {searchWidget}
    </div>
  )
}

export default Banner