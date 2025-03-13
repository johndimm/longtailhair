import React, { useState, useEffect, useContext, useRef } from 'react'
import styles from "@/styles/Genres.module.css"
import { StateContext } from '@/components/State'
import { useRouter } from 'next/router';
import GenresHistogram from '@/components/GenresHistogram'

const Genres = ({genres, resetGenres, genresParamArray, urlParams }) => {
    const router = useRouter()
    const [genresCounts, setGenresCounts] = useState([])
    const [checkedItems, setCheckedItems] = useState([])

    //const parameters = useContext(StateContext)
    //const { genres, numMovies, yearstart, yearend, query, nconst, titletype, ratingsFilter, sortOrder} = parameters.values
    //const { genresParamArray, urlParams } = parameters

    const genresList = [
        'Action',
        'Adult',
        'Adventure',
        'Animation',
        'Biography',
        'Comedy',
        'Crime',
        'Documentary',
        'Drama',
        'Family',
        'Fantasy',
        'Film-Noir',
        'Game-Show',
        'History',
        'Horror',
        'Music',
        'Musical',
        'Mystery',
        'News',
        'Reality-TV',
        'Romance',
        'Sci-Fi',
        'Sport',
        'Talk-Show',
        'Thriller',
        'War',
        'Western'
    ]

    useEffect(() => {
        if (!router.isReady)
            return

        // console.log("====> counting genres") //, genresParamArray)

        setCheckedItems(genres ? genres.split(',') : [])
        countGenres()

    }, genresParamArray) // [genres, numMovies, yearstart, yearend, query, nconst, titletype, ratingsFilter, sortOrder]) // genresParamArray)

      //[genres, numMovies, yearstart, yearend, query, nconst, titletype, ratingsFilter, sortOrder])

    const countGenres = async () => {
        const url = '/api/count_genres?' + urlParams

        const response = await fetch(url)
        const result = await response.json()

        const countsHash = {}
        result.forEach((g, idx) => {
            // console.log(`${g.genre} count:[${g.count}]`)
            countsHash[g.genre] = g.count
        })

        const countsAll = {}
        genresList.forEach((genre, idx) => {
            countsAll[genre] = countsHash.hasOwnProperty(genre) ? countsHash[genre] : 0
            // console.log(`genre ${genre} countsAll: ${countsAll[genre]}`)
        })
        setGenresCounts(countsAll)
    }

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;

        let newCheckedItems
        if (checked) {
            newCheckedItems = [...checkedItems, value]
        } else {
            newCheckedItems = checkedItems.filter((item) => item !== value)
        }

        setCheckedItems(newCheckedItems)
        // console.log(checkedItems, newCheckedItems)

        // console.log(" **** resetGenres")
        parameters.resetGenres(newCheckedItems.join(','))
    };

    const selectOneGenre = (genre) => {
        parameters.resetGenres(genre)
        setCheckedItems([genre])
    }

    //const tci = genres ? genres.split(',') : []
    const genresListHtml = genresList.map((genre, idx) => {
        const count = genresCounts[genre]
        const checked = checkedItems.indexOf(genre) != -1
        const disabledFlag = (count == '' || count == 0) // && checkedItems.length > 0
        // console.log(`genre ${genre}, count[${count}] disabledFlag ${disabledFlag}`)
        return (
            <div key={idx} className={styles.checkbox_line}>
                <label htmlFor="{genre}">
                    <input id={genre} name={genre} type='checkbox' value={genre} disabled={disabledFlag}
                        checked={checked} onChange={handleCheckboxChange} />
                    &nbsp;
                    <span className={styles.genre_name} onClick={() => {
                        selectOneGenre(genre)
                    }}>{genre}</span>
                    <span className={styles.genre_count}>{count}</span>
                </label>
            </div>
        )
    })

    const genresHistogramData = genresList.map((genre, idx) => {
        return {genre: genre, count: genresCounts[genre]}
    })

    // console.log(" ***** render Genres")
    return <div className={styles.genres}>
       <GenresHistogram 
       initialData={genresHistogramData} 
       initialGenres={checkedItems}
       resetGenres={resetGenres} />
    </div>
}

export default Genres