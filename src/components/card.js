import { useContext, useState, useEffect } from 'react'
import styles from "@/styles/Main.module.css";
import { CallbackContext } from '@/components/Main'
import clsx from 'clsx'

const StarRating = ({ score }) => {
  const filledStars = Math.round(score / 2.5);

  const stars = Array.from({ length: filledStars }, (v, i) => (
    <span key={i}>&#9733;</span>
  ));

  return <span className={styles.star_rating}>{stars}</span>
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
  const role = r.role.replace(/\[/g, '').replace(/\]/g, '').replace(/_/g, ' ')

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

export const Card = ({
  recs,
  selectedPerson,
  isScrolling,
  theme
}) => {
  const [topClass, setTopClass] = useState(clsx(styles.card, styles.card_black))
  // const [showingBigPic, setShowingBigPic] = useState(false)


  const callbacks = useContext(CallbackContext)
  const { resetGenres, resetYear, resetMovie, resetActor, cardDim } = callbacks

  useEffect(() => {
    if (recs && recs.length > 0) {
      const poster_url = recs[0].poster_url
      const primaryTitle = recs[0].primarytitle
      if (!poster_url || poster_url == '') {
        //console.log("useEffect sets card white", poster_url, primaryTitle)
        const className = theme == 'light' ? styles.card_white_light : styles.card_white
        setTopClass(clsx(styles.card, className))
      } else {
        const className = theme == 'light' ? styles.card_light : styles.card_black
        setTopClass(clsx(styles.card, className))
      }
    }
  }, [recs, theme])

  if (!recs || recs.length == 0)
    return null

  const r1 = recs[0]

  const isDirector = (r) => {
    return r.role.split(', ').indexOf('director') != -1
  }

  const isNotDirector = (r) => {
    return r.role.split(', ').indexOf('director') == -1
  }


  let slicedRecs = recs
  if (r1.place == 'genres' && r1.poster_url != null) {
    // Get the director.
    const rec_director = recs.filter(isDirector)
    if (rec_director.length > 0) {
      slicedRecs = rec_director.concat(recs.filter(isNotDirector).slice(0, 4 - rec_director.length))
    } else {
      slicedRecs = recs.slice(0, 4)
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

  const goToMovie = () => {
    resetMovie(r1.tconst)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  let poster = null
  if (r1.poster_url && r1.poster_url != '') {
    const poster_url = r1.poster_url.replace('w200', 'w400').replace('SX300', 'SX600')
    poster = <img
      src={poster_url}
      onClick={goToMovie}
      onLoad={(e) => {
        e.target.style.display = 'inline-block'
      }}
      onError={(e) => {
        console.log(`cover image load error for ${r1.primarytitle}, ${poster_url} ${e}`)
        markPosterError(r1.tconst)

        e.target.style.display = 'none'
      }} />

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
  if (r1.place != 'center')
    plot_sentence = r1.plot_summary ? r1.plot_summary.substring(0, 150) + '...' : ''

  const plotHtml = r1.plot_summary ?
    <div className={styles.plot_summary}>
      {plot_sentence}
    </div>
    : null

  let style = {}
  if (r1.place == 'genres' && theme == 'dark')
    style = cardDim

  let external_links = null
  if (r1.place == 'center') {
    const item = `"${r1.primarytitle}" (${r1.startyear})`
    const google_query = encodeURI(`where can I watch ${item}?`)
    const url = `https://www.google.com/search?q=${google_query}`

    const encodeItem = encodeURI(item)
    const rotten = `https://www.rottentomatoes.com/search?search=${encodeItem}`

    const letterboxItem = encodeURI(`${r1.primarytitle} ${r1.startyear}`)
    const letterboxd = `https://letterboxd.com/search/${letterboxItem}`

    external_links = <div className={styles.external_links}>
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

  return <div className={topClass} style={style}>

    <div className={styles.card_text}>

      <div>
        <div onClick={goToMovie}>
          <div className={styles.movie_title}>
            {title}
          </div>

          <hr />
          {center_poster}
          {plotHtml}

        </div>

        <div className={styles.persons}>
          {persons}
        </div>

      </div>


      <div className={styles.metadata}>
        <StarRating score={r1.averagerating} />

        <span
          className={styles.year}
          title={`Show only movies made in ${r1.startyear}`}
          onClick={() => resetYear(r1.startyear)}>
          {r1.startyear}
        </span>
        <span>
          {icon}
        </span>
        <br />
        <span
          className={styles.genres}
          title={`Show only movies that include the genres ${r1.genres}`}
          onClick={() => resetGenres(r1.genres)}>
          {genres}
        </span>
        {external_links}
      </div>


    </div>

    {right_poster}
  </div>
}

export const Sidebar = ({
  data,
  place,
  selectedPerson,
  isScrolling,
  theme
}) => {

  // Aggregate multiple actors in the same film.
  const agg = {}
  data.filter(r => r.place == place).forEach((r, idx) => {
    const movie = r.tconst
    if (!(movie in agg)) {
      agg[movie] = []
    }
    agg[movie].push(r)
  })

  return Object.keys(agg).map((tconst, idx) => {
    const recs = agg[tconst]

    return <Card
      key={idx}
      recs={recs}
      selectedPerson={selectedPerson}
      position="sidebar"
      isScrolling={isScrolling}
      theme={theme} />

  })
}