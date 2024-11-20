import React, { useState, useEffect } from 'react'
import styles from "@/styles/Actor.module.css"

const Actor = ({ nconst, actorName, resetActor }) => {
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
  
    const width = 200
    const url_prefix = `https://image.tmdb.org/t/p/w${width}`
    const profilePicture = data.hasOwnProperty("profile_path") 
      && nconst
      && data["profile_path"] != null
      ? <img src={url_prefix + data["profile_path"]} />
      : <></>
  
    const imdbUrl = `https://www.imdb.com/name/${nconst}`
    // console.log('imgUrl', imgUrl)
  
    const imdbLink = nconst
      ? <a title="person in imdb" target='_imdb' href={imdbUrl}>imdb</a>
      : <></>

    const closeButton = nconst
      ? <span className={styles.close_button} onClick={(e) => resetActor(nconst)}>X</span>
      : <></>
  
    const name = nconst ? data.name : ''

    return <div className={styles.selected_actor}>
      <div className={styles.selected_actor_pix}>
      <a href={imdbUrl} target="_imdb">
        {closeButton}
        {profilePicture}
        <br />
        {name}
        </a>
        {closeButton}
      </div>

    </div>
  }

  export default Actor