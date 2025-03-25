import { useContext, useState, useEffect } from 'react'
import styles from "@/styles/Main.module.css";
import { StateContext } from '@/components/State'
import clsx from 'clsx'
import Ratings from "@/components/Ratings"

const ExternalLinks = ({ r1 }) => {

  if (r1.place != 'center') {
    return null
  }

  const item = `"${r1.primarytitle}" (${r1.startyear})`
  const google_query = encodeURI(`where can I watch ${item}?`)
  const url = `https://www.google.com/search?q=${google_query}`

  const encodeItem = encodeURI(item)
  const rotten = `https://www.rottentomatoes.com/search?search=${encodeItem}`

  const letterboxItem = encodeURI(`${r1.primarytitle} ${r1.startyear}`)
  const letterboxd = `https://letterboxd.com/search/${letterboxItem}`

  return <div className={styles.external_links}>
    <ul>
      <li>
        <a target="_imdb" title={`${r1.titletype} in imdb`}
          href={`https://www.imdb.com/title/${r1.tconst}/`}>Internet Movie Database</a>
      </li>
      <li>
        <a href={url} target="_where_to_watch">Google: where to watch</a>
      </li>
      <li>
        <a href={rotten} target="rotten_tomatoes">Rotten Tomatoes</a>
      </li>
      <li>
        <a href={letterboxd} target="letterboxd">Letterboxd</a>
      </li>
    </ul>
  </div>
}


const markPosterError = (tconst) => {
  console.log("marking failed poster from ", tconst)
  const url = `/api/mark_poster/${tconst}`
  fetch(url)
}

const Person = ({ r, selectedPerson, resetActor }) => {
  const age = r.age ? `(${r.age})` : ''
  const roleStyle = r.role.indexOf('[') != -1
    ? { "fontStyle": "italic" }
    : { "fontStyle": "normal" }
  const role = r.role.replace(/\[/g, '').replace(/\]/g, '').replace(/_/g, ' ').replace(/,.*/, '')

  const style = r.nconst == selectedPerson
    ? { "color": "red" }
    : null

  return <div className={styles.person}>
    <div
      className={styles.person_name}
      style={style}
      onClick={() => {
        resetActor(r.nconst);
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}>
      {r.primaryname}
      <span className={styles.age}>{age}</span>
    </div>
    <div className={styles.role} style={roleStyle}>{role}</div>
  </div>
}

const Card = ({
  recs,
  selectedPerson,
  theme,
  getData,
  numReturnedMovies,
  cardDim
}) => {
  // const [topClass, setTopClass] = useState(clsx(styles.card, styles.card_light))
  const parameters = useContext(StateContext)
  const { resetGenres, resetYear, resetMovie, resetActor, setOffset } = parameters.setters
  const { 
    //cardDim, 
    aiModel, numMovies, offset } = parameters.values
  const { user } = parameters

  if (!recs || recs.length == 0)
    return null

  const r1 = recs[0]

  console.log("place:", r1.place)
  if (r1.place == 'center') {
    console.log("center")
  }

  const hasPoster = r1.poster_url && r1.poster_url != ''
  const layoutOne = numMovies == 1
  const inSidebar = (r1.place == 'left' || r1.place == 'right')
  const inCenter = r1.place == 'center'
  const inSearchResults = r1.place == 'genres'
  const lightTheme = theme == 'light'

  let secondClass = null // styles.card_dark
  if (layoutOne && inSearchResults && lightTheme) {
    secondClass = styles.card_one
  } else if (layoutOne && inSearchResults && !lightTheme) {
    secondClass = styles.card_one_dark
  } else if (inCenter) {
    secondClass = null
  } else if (hasPoster && lightTheme) {
    secondClass = styles.card_light
  } else if (!hasPoster && lightTheme) {
    secondClass = styles.card_white_light
  } else if (hasPoster && !lightTheme) {
    secondClass = styles.card_dark
  } else if (!hasPoster && !lightTheme) {
    secondClass = styles.card_white
  }

  const topClass = clsx(styles.card, secondClass)

  /*
  useEffect(() => {
    if (recs && recs.length > 0) {
      const poster_url = recs[0].poster_url

      if (numMovies == 1) {
        setTopClass(clsx(styles.card, styles.card_one))
        return
      }

      if (!poster_url || poster_url == '') {
        const className = theme == 'light' ? styles.card_white_light : styles.card_white
        setTopClass(clsx(styles.card, className))
      } else {
        const className = theme == 'light' ? styles.card_light : styles.card_dark
        setTopClass(clsx(styles.card, className))
      }
    }
  }, [recs, theme])
  */




  const isDirector = (r) => {
    return r.role.split(', ').indexOf('director') != -1
  }

  const isNotDirector = (r) => {
    return r.role.split(', ').indexOf('director') == -1
  }

  let slicedRecs = recs
  if (r1.place == 'genres') {
    // Show director first.
    const rec_director = recs.filter(isDirector)

    // Show only 4 to 6 persons.
    const numPersons = (r1.poster_url != null && numMovies > 1) ? 4 : 30
    if (rec_director.length > 0) {
      slicedRecs = rec_director.concat(
        recs.filter(isNotDirector).slice(0, numPersons - rec_director.length)
      )
    } else {
      slicedRecs = recs.slice(0, numPersons)
    }
  }

  const persons = slicedRecs.map((rec, idx) => {
    return <Person
      key={idx}
      r={rec}
      selectedPerson={selectedPerson}
      resetActor={resetActor} />
  })

  const genres = r1.genres ? r1.genres.replace(/,/g, ', ') : ''

  const goToMovie = (tconst) => {
    resetMovie(tconst)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  let poster = null
  if (r1.poster_url && r1.poster_url != '') {
    const poster_url = r1.poster_url.replace('w200', 'w400').replace('SX300', 'SX600')
    poster = <img
      src={poster_url}
      onClick={() => {
        goToMovie(r1.tconst)
      }}
      onLoad={(e) => {
        e.target.style.display = 'inline-block'
        e.target.style.opacity = 1
        // e.target.style.display = 'none'
      }}
      onError={(e) => {
        console.log(`cover image load error for ${r1.primarytitle}, ${poster_url} ${e}`)
        markPosterError(r1.tconst)

        e.target.style.display = 'none'
      }} />
    //poster = null

    if (r1.place == 'center') {
      poster = <a href={poster_url} target="_blank">{poster}</a>
    }
  }

  const center_poster = r1.place == 'center'
    ? poster
    : null

  const right_poster = r1.place == 'center'
    ? null
    : poster

  const icon = r1.titletype == 'movie'
    ? <>&#127909;</>
    : <>&#128250;</>

  const title = r1.primarytitle.length < 30
    ? <>{r1.primarytitle}</>
    : <span style={{ "display": "flex", "fontSize": "70%", "lineHeight": "1.2", "flexWrap": 'wrap', }}>{r1.primarytitle}</span>

  let plot_sentence = r1.plot_summary

  if (r1.place != 'center') {
    if (r1.user_rating_msg) { //} && !r1.user_rating_msg.includes('is a popular')) {
      plot_sentence = r1.user_rating_msg
    }
    // Should be able to cut off only if longer than 150, but no.
    if (numMovies != 1 && plot_sentence && plot_sentence == r1.plot_summary && plot_sentence != '') {
      plot_sentence = plot_sentence.substring(0, 150) + '...'
    }
  }

  const plotHtml = plot_sentence ?
    <div className={styles.plot_summary}>
      {plot_sentence}
    </div>
    : null

  let style = {}
  if (r1.place == 'genres' && theme == 'dark')
    style = cardDim

  // console.log("card -- tconst:", r1.tconst, " user_rating:", r1.user_rating)

  const resetOffset = (increment) => {
    const newOffset = Math.max(0, offset + increment)
    setOffset(newOffset)
  }

  const navStyle = layoutOne ? {} : { "display": "none" }

  return <div className={topClass} style={style}>
    <div className={styles.card_text}>

      <div>
        <div onClick={() => goToMovie(r1.tconst)}>
          <div className={styles.movie_title}>
            {title}
          </div>

          <hr />
          <div className={styles.poster}>
            {center_poster}
          </div>
          {plotHtml}

        </div>

        <div className={styles.persons}>
          {persons}
        </div>

      </div>

      <div className={styles.metadata}>

        <Ratings user_id={user.id} tconst={r1.tconst}
          user_rating={r1.user_rating} averagerating={r1.averagerating}
          getData={getData} titletype={r1.titletype} genres={r1.genres} aiModel={aiModel} />

        <span
          className={styles.year}
          title={`Show only movies made in ${r1.startyear}`}
          onClick={() => resetYear(r1.startyear)}>
          {r1.startyear}
        </span>
        <span className={styles.icon}>
          {icon}
        </span>

        <span
          className={styles.genres}
          title={`Show only movies that include the genres ${r1.genres}`}
          onClick={() => resetGenres(r1.genres)}>
          {genres}
        </span>
      </div>
      <div style={{
        fontSize: '200%',
        cursor: "pointer",
        display: numMovies == 1 ? 'block' : 'none'
      }}>

      </div>
      <ExternalLinks r1={r1} />

    </div>
    <div className={styles.poster}>
      {right_poster}
    </div>
    <div className={styles.nav_prev_next} style={navStyle}>
      <span onClick={() => resetOffset(-1)} className={styles.prev}>&#9664;</span>
      <span onClick={() => resetOffset(1)} className={styles.next}>&#9654;</span>
    </div>

  </div>
}

export default Card

