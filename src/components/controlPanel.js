import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import { CallbackContext } from '@/components/Main'
import Actor from "@/components/Actor"
import YearPicker from "@/components/YearPicker"
import Genres from "@/components/Genres"
import styles from "@/styles/ControlPanel.module.css"
import { NUM_MOVIES, MIN_YEAR, MAX_YEAR } from "@/util/constants"


const ControlPanel = ({ actorName, setTheme, theme,
    ratingsFilter, setRatingsFilter, sortOrder, setSortOrder, toggleShowControlPanel,
    showControlPanel }) => {

    const callbacks = useContext(CallbackContext)
    const { resetGenres, resetMovie, resetActor,
        resetQuery, resetYearstart, resetYearend, setTitletype, setNumMovies,
        nconst, titletype, genres,
        query, yearstart, yearend, setCardDim, user } = callbacks
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
            <div className={styles.widget}>
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
            <div className={styles.widget}>
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
        if (!user.id)
            return null

        const ratings = ['all', 'rated', 'not rated', 'interested', 'recommendations']
        console.log('ratingsFilter', ratingsFilter)
        const ratingsOptions = ratings.map((rating, idx) => {
            const style = rating == ratingsFilter
                ? { fontWeight: 600, fontStyle: 'italic' }
                : { fontWeight: 200 }
            return <li key={idx} style={style} onClick={() => setRatingsFilter(rating)}>{rating}</li>
        })

        return (
            <div className={styles.widget}>
                <h3>
                    Ratings
                </h3>
                <ul>
                    {ratingsOptions}
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

                    <div className={styles.widget}>
                        {credits}
                    </div>

                    <div className={styles.menu}>
                        <SourcesWidget />
                        <RatingsWidget />
                        <SortOrderWidget />
                        <ThemesWidget />
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