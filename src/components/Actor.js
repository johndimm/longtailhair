import React, { useState, useEffect } from 'react'
import styles from "@/styles/Actor.module.css"

const Actor = ({ nconst, resetActor }) => {
  // return <></>
  const [data, setData] = useState([])

  const getActor = async (nconst) => {
    const url = `/api/get_actor/${nconst}`
    const response = await fetch(url)
    const data = await response.json()
    setData(data)
  }

  useEffect(() => {
    if (nconst)
      getActor(nconst)
  }, [nconst])

  if (!data)
    return null

  const onClick = nconst ? (e) => resetActor(nconst) : null

  const width = 200
  const url_prefix = `https://image.tmdb.org/t/p/w${width}`
  let profilePicture
  const hasImage = data.hasOwnProperty("profile_path")
    && nconst
    && data["profile_path"] != null

  if (hasImage) {
    profilePicture = <img onClick={onClick} src={url_prefix + data["profile_path"]} />
  } else {
    profilePicture = <div className={styles.profile_picture}>
      <img className={styles.logo_credit} src="/graph-logo-60.jpg" />
    </div>
  }

  const imdbUrl = `https://www.imdb.com/name/${nconst}`
  // console.log('imgUrl', imgUrl)

  const imdbLink = nconst
    ? <a title="person in imdb" target='_imdb' href={imdbUrl}>imdb</a>
    : <></>


  const closeButton = nconst
    ? <span className={styles.close_button} onClick={onClick}>X</span>
    : <></>

  const name = nconst ? data.name : <span className={styles.logo_credit}></span>


  return <div className={styles.selected_actor} onClick={onClick}>
    <div>
      <div style={{float: "right"}}>
      {closeButton}
      {profilePicture}
      </div>
      <div className={styles.actor_name}>
        {name}
      </div>
      {closeButton}
    </div>

  </div>
}

export default Actor