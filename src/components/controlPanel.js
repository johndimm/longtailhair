import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import { StateContext } from '@/components/State'
import Actor from "@/components/Actor"
import YearPicker from "@/components/YearPicker"
import Genres from "@/components/Genres"
import styles from "@/styles/ControlPanel.module.css"
import { NUM_MOVIES, MIN_YEAR, MAX_YEAR } from "@/util/constants"
import RequestRecs from "@/components/RequestRecs"

const ControlPanel = ({ toggleShowControlPanel}) => {

    const parameters = useContext(StateContext)
    const { resetGenres, resetMovie, resetActor,
        resetQuery, resetYearstart, resetYearend, 
        setTitletype,  setTheme, setRatingsFilter, setCardDim, 
        setSortOrder,  setAIModel, resetAll } = parameters.setters
    const {
        nconst, titletype, genres, theme,
        query, yearstart, yearend, user_id, 
        ratingsFilter, showControlPanel, sortOrder, aiModel} = parameters.values
    const {user, genresParamArray, urlParams } = parameters

    const [recsCounts, setRecsCounts] = useState({ nOld: 0, nNew: 0 })
    const [prompt, setPrompt] = useState()

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
        ? <div className={styles.card_dim_slider} >
            zoom:
            <input id="zoom-slider" type="range"
                min="150" max="600"
                defaultValue="310"
                onChange={newCardDim} />
        </div>
        : <></>

    const actorWidget = (
        <div className={styles.widget}>
            <Actor nconst={nconst}
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

    const SourcesWidget = (() => {
        const sources = [
            {dbName:'movie', displayName:'movies'},
            {dbName:'tv', displayName:'tv'},
            {dbName:null, displayName:'both'}
        ]
        const sourceOptions = sources.map((source, idx) => {
            const style = source.dbName == titletype
                ? { fontWeight: 600, fontStyle: 'italic' }
                : { fontWeight: 200 }
            return <li key={idx} style={style} onClick={() => setTitletype(source.dbName)}>{source.displayName}</li>
        })
        return (
            <div>
                <h3>
                    Source
                </h3>
                <ul>
                    {sourceOptions}
                </ul>
            </div>
        )
    })

    const ThemesWidget = (() => {
        const themes = ['light', 'dark']
        const themesOptions = themes.map((_theme, idx) => {
            const style = _theme == theme
                ? { fontWeight: 600, fontStyle: 'italic' }
                : { fontWeight: 200 }
            return <li key={idx} style={style} onClick={() => setTheme(_theme)}>{_theme}</li>
        })
        return (
            <div>
                <h3>
                    Theme
                </h3>
                <ul>
                    {themesOptions}

                </ul>
            </div>
        )
    })

    const RatingsWidget = (() => {
        const style = user.id
            ? { color: 'black' }
            : { color: 'gray' }

        const ratings = [
            { dbName: 'all', displayName: 'everything' },
            { dbName: 'rated', displayName: 'rated by me' },
            { dbName: 'watchlist', displayName: 'want to watch'},
            { dbName: 'not rated', displayName: 'not yet rated' },
            { dbName: 'recommendations', displayName: 'recommended' }
        ]
        // ', ratingsFilter)
        const ratingsOptions = ratings.map((rating, idx) => {
            const style = rating.dbName == ratingsFilter
                ? { fontWeight: 600, fontStyle: 'italic' }
                : { fontWeight: 200 }
            return <li key={idx} style={style} onClick={() => {
                if (user.id) setRatingsFilter(rating.dbName)
            }}>{rating.displayName}</li>
        })

        const tooltip = user.id
            ? ""
            : "sign in to rate and get recommendations"

        return (
            <div className={styles.widget} style={style} title={tooltip}>
                <h3>
                    Filters
                </h3>
                <ul>
                    {ratingsOptions}
                </ul>

            </div>
        )
    })

    const getRecommendations = () => {

        const url = `/api/get_recommendations?user_id=${user.id}&titletype=${titletype}&genres=${genres}&aiModel=${aiModel}`
        console.log(url)
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("===> recommendations:", data)
                setRecsCounts(data)
                setRatingsFilter('recommendations')
                resetMovie(null)
                resetGenres(null)
                resetQuery(null)
                resetYearstart(null)
                resetYearend(null)
            })

    }

    const showPrompt = async (e) => {
        if (prompt) { 
            setPrompt(null)
            return
        }
        
        const url = `/api/get_prompt?user_id=${user.id}&titletype=${titletype}&genres=${genres}&aiModel=${aiModel}`
        const response = await fetch(url)
        const result = await response.json()
        setPrompt(result.prompt)
    }

    const promptStyle = prompt 
      ? {display: 'inline-block'}
      : {display: 'none'}

    const RecommendationsWidget = (() => {
        const aiModels = ["Claude", "ChatGPT", "DeepSeek", "Gemini"]
        const recsOptions = aiModels.map((source, idx) => {
            const defaultChecked = source == aiModel
            return <div key={idx} style={{ 'whiteSpace': 'nowrap' }}>
                <input type="radio" id={source} name="model" value={source}
                    defaultChecked={defaultChecked} disabled={!user.id} onClick={() => setAIModel(source)} />
                <label htmlFor={source} onClick={() => setAIModel(source)}>{source}</label>
            </div>
        })

        const style = user.id
            ? { color: 'black' }
            : { color: 'gray' }

        const tooltip = user.id
            ? ""
            : "sign in to rate and get recommendations"

        const showPromptButtonStyle = prompt 
          ? {fontWeight: 600}
          : {}

        const buttonStyle = {fontSize:"10pt", padding:"3px"}  

        return (
            <div className={styles.widget} style={style} title={tooltip}>
                <h3>
                    Devtools
                </h3>

                <ul>

                    <li>
                        <b>models</b>

                        {recsOptions}

                    </li>
                </ul>
                <div><RequestRecs user={user} generateRecs={getRecommendations} buttonText="run now!" style={buttonStyle} /></div>
                <ul>
                    <li onClick={showPrompt} style={showPromptButtonStyle}>show prompt</li>
                    <li>already rated: {recsCounts.nOld}</li>
                    <li>new: {recsCounts.nNew}</li>
                </ul>

            </div>
        )

    })

    const SortOrderWidget = (() => {
        const options = [{ sort: 'popularity desc', name: 'most popular' },
        { sort: 'popularity', name: 'least popular' },
        { sort: 'year desc', name: 'latest' },
        { sort: 'year', name: 'earliest' }
        ]

        const optionsList = options.map((option, idx) => {
            const style = option.sort == sortOrder
                ? { fontWeight: 600, fontStyle: 'italic' }
                : { fontWeight: 200 }
            return <li key={idx} style={style} onClick={() => setSortOrder(option.sort)}>{option.name}</li>
        })

        return (
            <div className={styles.widget}>
                <h3>
                    Sort
                </h3>
                <ul>
                    {optionsList}
                </ul>

            </div>
        )

    })


    const style = showControlPanel
        ? { display: "block" }
        : { display: "none" }
    //console.log(" **** render ControlPanel, user_id:", 
    //    user.id, " showControlPanel:", showControlPanel)
    if (!showControlPanel)
        return null

    return (
        <div className={styles.controls} style={style}>
            <div className={styles.controls_content} >
                <div className={styles.genres_widget}>
                    <Genres
                        genres={genres}
                        genresParamArray={genresParamArray}
                        urlParams={urlParams}
                        resetGenres={resetGenres}
                    />
                </div>

                <div className={styles.right_controls}>

                    <div className={styles.menu}>
                        <div className={styles.widget}>
                            <SourcesWidget />
                            <br />
                            <ThemesWidget />
                        </div>
                        <SortOrderWidget />
                        <RatingsWidget />
                        <RecommendationsWidget />
                    </div>

                    <div className={styles.bottom_widgets}>

                        <div className={styles.date_widget}>
                            <YearPicker
                                setParentYearstart={resetYearstart}
                                setParentYearend={resetYearend}
                                goLeft={goLeft}
                                goRight={goRight}
                                yearstart={yearstart}
                                yearend={yearend} />
                        </div>


                        <div >
                            {zoom}
                        </div>

                        <div>
                            <button className={styles.resetButton} onClick={resetAll}>reset</button>
                            <button className={styles.resetButton} onClick={toggleShowControlPanel}>close</button>
                        </div>

                    </div>

                </div>
            </div>
            <div className={styles.prompt} style={promptStyle}>
              <pre>
            {prompt}
            </pre>
            </div>

        </div>
    )
}

export default ControlPanel