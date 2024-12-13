import React, { useState, useEffect, useContext } from 'react'
import styles from "@/styles/Genres.module.css"
import { CallbackContext } from '@/components/Main'
import { useRouter } from 'next/router';

const Genres = ({ genres, query, yearstart, yearend, nconst, titletype }) => {
    const router = useRouter()
    const [genresCounts, setGenresCounts] = useState([])
    const [checkedItems, setCheckedItems] = useState([]) //genres ? genres.split(',') : [])

    const callbacks = useContext(CallbackContext)
    const { resetGenres } = callbacks

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

        setCheckedItems(genres ? genres.split(',') : [])
        //setTimeout (countGenres, 2000)
        countGenres()
    }, [genres, query, yearstart, yearend, nconst, titletype])

    const countGenres = async () => {
        //return
        const url = `api/count_genres?genres=${genres}&yearstart=${yearstart}&yearend=${yearend}&query=${query}&nconst=${nconst}&titletype=${titletype}`

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
        resetGenres(newCheckedItems.join(','))
    };

    const selectOneGenre = (genre) => {
        resetGenres(genre)
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
                <input id={genre} name={genre} type='checkbox' value={genre} disabled={disabledFlag}
                    checked={checked} onChange={handleCheckboxChange} />
                &nbsp;
                <span className={styles.genre_name} onClick={() => {
                    selectOneGenre(genre)
                }}>{genre}</span>
                <span className={styles.genre_count}>{count}</span>
            </div>
        )
    })

    return <div className={styles.genres}>
        {genresListHtml}
    </div>
}

export default Genres