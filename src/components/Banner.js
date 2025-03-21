import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import { StateContext } from '@/components/State'
import Actor from "@/components/Actor"
import styles from "@/styles/ControlPanel.module.css"
import { NUM_MOVIES, MIN_YEAR, MAX_YEAR } from "@/util/constants"
import { signIn, signOut, useSession } from "next-auth/react";

const registerUser = async (email, name, setUser, setNumRatings) => {
  const url = `/api/register?email=${email}&name=${name}`
  const response = await fetch(url)
  const result = await response.json()
  console.log("user_id:", result.user_id)
  setUser({id:result.user_id, email: email, name: name})

  await updateNumRatings (result.user_id, setNumRatings)
}

const updateNumRatings = async (user_id, setNumRatings) => {
    const url = `/api/get_num_ratings/${user_id}`
    const response = await fetch(url)
    const result = await response.json()
    setNumRatings (result[0].num_ratings) 
}

const AuthButton = ( {setUser, setNumRatings} ) => {
  const { data: session } = useSession();

  useEffect( () => {
    if (session) {
      registerUser(session.user.email, session.user.name, setUser, setNumRatings)
    }
  }, [session])

  // return null

  if (session) {
    const shortName = session.user.name.replace(/ .*/, '')

    return (
      <div className={styles.sign_in}>
        <p style={{marginBottom: "5px"}}>{shortName}</p>
        <button  onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

//  return <button onClick={() => signIn("google")}>Sign in with Google</button>;
  return (
    <div className={styles.sign_in}>
    <button onClick={() => signIn("google")} title='To rate movies and get recommendations'>sign in with Google</button>
    </div>
  )
}

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



const Banner = ({ toggleShowControlPanel }) => {

  const parameters = useContext(StateContext)
  const { resetActor, resetQuery, setCardDim, setUser, 
    setNumRatings, setRatingsFilter} = parameters.setters
  const { nconst, query, theme, showControlPanel, numRatings, ratingsFilter} = parameters.values

  const newCardDim = (e) => {
    const val = e.target.value
    const width = parseInt(val)
    const height = width * 480 / 310
    const style = { width: width + 'px', height: height + 'px' }
    setCardDim(style)
  }


  const actorWidget = (
    <div className={styles.widget}>
      <Actor nconst={nconst}ƒ
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

  const searchWidget = (
    <div className={styles.search_widget}>
      <SearchForm query={query} resetQuery={resetQuery} />
    </div>
  )

  const ratingsCountStyle = numRatings % 10 == 0
    ? {color: 'red', fontWeight: '600'}
    : {}

  const numRatingsWidget = (
    <div className={styles.widget} onClick={() => {
      setRatingsFilter('rated')
      const newRatingsFilter = ratingsFilter == 'recommendations'
        ? 'all'
        : 'recommendations'
      setRatingsFilter(newRatingsFilter)
    }}
      style={{cursor: 'pointer'}}
      title={ratingsFilter == 'recommendations' ? 'show everything' : 'show recommended'}>
      <div className={styles.num_ratings} style={ratingsCountStyle}>{numRatings}</div>
      <span>ratings</span>
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
      {numRatingsWidget}
      <AuthButton setUser={setUser} setNumRatings={setNumRatings}/>
    </div>
  )
}

export default Banner