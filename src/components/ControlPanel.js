import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import { CallbackContext } from '@/components/Main'
import Actor from "@/components/Actor"
import YearPicker from "@/components/YearPicker"
import Genres from "@/components/Genres"
import styles from "@/styles/ControlPanel.module.css"
import { NUM_MOVIES, MIN_YEAR, MAX_YEAR } from "@/util/constants"
import RequestRecs from "@/components/RequestRecs"

const ControlPanel = ({ actorName, setTheme, theme,
    ratingsFilter, resetRatingsFilter, sortOrder, setSortOrder, toggleShowControlPanel,
    showControlPanel, aiModel, setAiModel }) => {

    const callbacks = useContext(CallbackContext)
    const { resetGenres, resetMovie, resetActor,
        resetQuery, resetYearstart, resetYearend, setTitletype, setNumMovies,
        nconst, titletype, genres,
        query, yearstart, yearend, setCardDim, user } = callbacks

    const [recsCounts, setRecsCounts] = useState({ nOld: 0, nNew: 0 })


    // const [showGenres, setShowGenres] = useState(true)

    //if (!showControlPanel)
    //    return null

    useEffect(() => {
        console.log(" ==== initializing ControlPanel")
    }, [])

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

    const SourcesWidget = (() => {
        const sources = ['movie', 'tv']
        const sourceOptions = sources.map((source, idx) => {
            const style = source == titletype
                ? { fontWeight: 600, fontStyle: 'italic' }
                : { fontWeight: 200 }
            return <li key={idx} style={style} onClick={() => setTitletype(source)}>{source}</li>
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

        const ratings = ['all', 'rated', 'not rated', 'interested', 'recommendations']
        console.log('ratingsFilter', ratingsFilter)
        const ratingsOptions = ratings.map((rating, idx) => {
            const style = rating == ratingsFilter
                ? { fontWeight: 600, fontStyle: 'italic' }
                : { fontWeight: 200 }
            return <li key={idx} style={style} onClick={() => {
                if (user.id) resetRatingsFilter(rating)
                }}>{rating}</li>
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
                resetRatingsFilter('recommendations')
                resetMovie(null)
                resetGenres(null)
                resetQuery(null)
                resetYearstart(null)
                resetYearend(null)
            })

    }

    const RecommendationsWidget = (() => {
        const aiModels = ["Claude", "ChatGPT", "DeepSeek", "Gemini"]
        const recsOptions = aiModels.map((source, idx) => {
            const defaultChecked = source == 'DeepSeek'
            return <div key={idx}>
                <input type="radio" id={source} name="model" value={source} 
                  defaultChecked={defaultChecked} disabled= {!user.id}/>
                <label htmlFor={source} onClick={() => setAiModel(source)}>{source}</label>
            </div>
        })

        const style = user.id
            ? { color: 'black' }
            : { color: 'gray' }

        const tooltip = user.id 
        ? ""
        : "sign in to rate and get recommendations"

        return (
            <div className={styles.widget} style={style} title={tooltip}>
                <h3>
                    Recommendations
                </h3>

                <ul>

                    <li>
                        models
                        <ul>
                            {recsOptions}
                        </ul>
                    </li>
                    <li><RequestRecs user={user} generateRecs={getRecommendations} buttonText="generate" /></li>
                    <ul>
                        <li>already rated: {recsCounts.nOld}</li>
                        <li>new: {recsCounts.nNew}</li>
                    </ul>
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
    console.log(" **** render ControlPanel, user_id:", user.id)
    return (
        <div className={styles.controls} style={style}>
            <div className={styles.controls_content} >
                <div className={styles.genres_widget}>
                    <Genres
                        genres={genres}
                        query={query}
                        yearstart={yearstart}
                        yearend={yearend}
                        nconst={nconst}
                        titletype={titletype}
                        ratingsFilter={ratingsFilter}
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
        </div>
    )
}

export default ControlPanel