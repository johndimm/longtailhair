import React, { useState, useEffect, useContext } from 'react'
import styles from "@/styles/Main.module.css"
import Cards from "@/components/Cards"
import Card from '@/components/Card'
import { StateContext } from '@/components/State'
import Spinner from "@/components/Spinner"
import Head from 'next/head'
import RequestRecs from "@/components/RequestRecs"

const Trailer = ({ tmdb_id, titletype }) => {
  const [data, setData] = useState([])

  const getTrailers = async (tmdb_id, titletype) => {
    if (!tmdb_id || tmdb_id == -1) {
      setData(null)
    } else
      if (tmdb_id) {
        const url = `/api/get_trailers/${tmdb_id}/${titletype}`
        // console.log(url)
        const response = await fetch(url)
        const data = await response.json()
        setData(data)
      }
  }

  useEffect(() => {
    getTrailers(tmdb_id, titletype)
  }, [tmdb_id])

  const youtube_embed = (key, name) => {
    const src = `https://www.youtube.com/embed/${key}`
    return <iframe id="youtube_embed" width="100%" height="200px"
      src={src}
      title={name}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      referrerPolicy="strict-origin-when-cross-origin"

      mozallowfullscreen="mozallowfullscreen"
      msallowfullscreen="msallowfullscreen"
      oallowfullscreen="oallowfullscreen"
      webkitallowfullscreen="webkitallowfullscreen"

      controls="1"
    >
    </iframe>

  }

  let trailers
  if (data) {
    trailers = data.map((trailer, idx) => {
      return <div key={idx}>{youtube_embed(trailer.key, trailer.name)}</div>
    })
  }

  return <div className={styles.trailers}>{trailers}</div>
}

const Movie = ({
  hideSearchPage,
  getData
}) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const parameters = useContext(StateContext)
  const { resetMovie, resetActor, resetGenres, resetQuery, 
    resetYearstart, resetYearend,  setRatingsFilter } = parameters.setters
  const { tconst, nconst, ratingsFilter, aiModel, theme } = parameters.values
  const { user } = parameters

  const getMovieData = async () => {
    setIsLoading(true)
    const url = `/api/get_movie?tconst=${tconst}&user_id=${user.id}`
    const response = await fetch(url)
    const result = await response.json()
    setData(result)
    setIsLoading(false)

    //if (tconst)
    //  hideSearchPage()
  }

  useEffect(() => {
    getMovieData()
  }, [tconst])

  const center_persons = data.filter(r => r.place == 'center')
  const center = <Card
    recs={center_persons}
    selectedPerson={nconst}
    theme={theme}
  />

  let tmdb_id
  let titletype
  let backdrop
  if (center_persons.length > 0) {
    const cp = center_persons[0]
    tmdb_id = cp.tmdb_id
    titletype = cp.titletype
    backdrop = cp.backdrop_url
  }

  if (backdrop) {
    const backdrop_url = backdrop.replace('w300', 'w1280').replace('SX300', 'SX1280')
    backdrop = <img className={styles.backdrop} src={backdrop_url} />
  }

  const generateSingleMovieRecs = async () => {
    const url = `/api/get_single_recs?tconst=${tconst}&titletype=${titletype}&user_id=${user.id}&aiModel=${aiModel}`
    const response = await fetch(url)
    const data = await response.json()
    const alreadyRecs = ratingsFilter == 'recommendations'
    setRatingsFilter('recommendations')
    resetActor(null)
    resetGenres(null)
    resetQuery(null)
    resetYearstart(null)
    resetYearend(null)
    if (alreadyRecs)
      getData()
    setTimeout(() => {
      document.querySelector('#search_page').scrollTo({ top: 0, behavior: 'smooth' })
    }, 1000)
  }

  if (!data || data.length == 0)
    return <Spinner isLoading={isLoading} />


//  <RequestRecs user={user} generateRecs={generateSingleMovieRecs} buttonText="Generate recommendations based on this movie" aiModel={aiModel}/>
//  <br />

  return <div className={styles.movie_page}>

    <Head>
      <meta
        name='viewport'
        content='width=device-width, initial-scale=0.5, maximum-scale=1.0, minimum-scale=0.01, user-scalable=yes'
      />
    </Head>

    <Spinner isLoading={isLoading} />

    <div className={styles.controls} style={{ "marginTop": "10px" }}>

      <span className={styles.page_title} style={{ "cursor": "pointer" }} title="go back" onClick={() => resetMovie(null)}>
        Collaborations
        <span className={styles.page_subtitle}>
          productions by members of this cast and crew before and after</span>

        <span className={styles.close_button}>
          X
        </span>

      </span>
    </div>

    <div className={styles.left}>
      <Cards
        data={data}
        place='left'
        selectedPerson={nconst}
        theme={theme}
      />
    </div>

    <div className={styles.center}>
      {center}

      {backdrop}
      <Trailer tmdb_id={tmdb_id} titletype={titletype} />
      <div className={styles.request_recs}>

      </div>
    </div>

    <div className={styles.right}>
      <Cards
        data={data}
        place='right'
        selectedPerson={nconst}
        theme={theme}
      />
    </div>

  </div>
}

export default Movie
