import { useContext, useState, useEffect, useRef } from 'react'
import styles from "@/styles/Main.module.css";
import { StateContext } from '@/components/State'
import Spinner from "@/components/Spinner"

const StarRating = ({ score }) => {
    const filledStars = Math.round(score / 2.0);

    const stars = Array.from({ length: filledStars }, (v, i) => (
        <span className={styles.star_rating} key={i}>&#9733;</span>
    ));

    return <span>{stars}</span>
}

const EditStarRating = ({ user_id, tconst, user_rating, dbSet }) => {
    const defaultNstars = user_rating > 0 ? user_rating : 0
    const [nStars, setNstars] = useState(defaultNstars)
    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        // console.log("useEffect, defaultNstars:", defaultNstars, " nStars:", nStars, " tconst:", tconst)
        setNstars(defaultNstars)
    }, [tconst, user_rating])

    const mouseEnter = (e, _nStars) => {
        e.preventDefault()
        //console.log("mouseEnter:", e.target.id, " nStars:", nStars, " new nStars:", _nStars, "tconst:", tconst)
        if (!clicked)
            setNstars(_nStars)
    }

    const mouseOut = (e) => {
        e.preventDefault()
        // console.log("mouseOut:", e.target.id)
        if (e.target.id == 'star-container') {
            if (!clicked)
                setNstars(defaultNstars)
        }
    }

    const click = (e, _nStars) => {
        setNstars(_nStars)
        dbSet(user_id, tconst, _nStars)
        setClicked(true)
    }

    // if (nStars > 0)
    // console.log("rendering ratings-- user_rating:", user_rating, " defaultNstars", defaultNstars, " nStars:", nStars, "tconst:", tconst)

    const stars = Array.from({ length: 5 }, (v, i) => {
        const style = i < nStars
            ? { color: "blue", cursor: "pointer" }
            : { color: "white", cursor: "pointer" }
        return <span
            id="star"
            className={styles.star_rating}
            style={style}
            key={i}
            onClick={(e) => click(e, i + 1)}
            onMouseEnter={(e) => mouseEnter(e, i + 1)}
        >&#9733;</span>
    });


    return <div
        onMouseOut={mouseOut}
        id="star-container">{stars}</div>
}

const Interest = ({ user_id, tconst, user_rating, dbSet }) => {
    const onClick = (_rating) => {
        dbSet(user_id, tconst, _rating)
    }

    const bold = { fontWeight: "600", fontSize: "120%" }
    const yesStyle = user_rating == -1 ? bold : {}
    const noStyle = user_rating == -2 ? bold : {}

    if (!user_id) {
        return null
    } else {
        return (
            <tr>
                <td style={{ verticalAlign: "top" }}>
                    want to see?
                    &nbsp;&nbsp;
                </td>
                <td>
                    <span
                        className={styles.yesno}
                        style={noStyle}
                        onClick={() => onClick(-2)}>no</span>
                    <span
                        className={styles.yesno}
                        style={yesStyle}
                        onClick={() => onClick(-1)}>yes</span>
                </td>
            </tr>
        )
    }

}


const Ratings = (({ user_id, tconst, user_rating, averagerating, getData, aiModel }) => {
    const [rating, setRating] = useState(user_rating)
    
    const parameters = useContext(StateContext)
    const { setRatingsCounts } = parameters.setters

    const isLoading = useRef(false)
    const setIsLoading = (val) => {
        isLoading.current = val
    }

    //console.log(`Ratings tconst:${tconst}, user_rating:${user_rating}`)

    const dbSet = async (user_id, _tconst, _rating) => {
        // User rated something.
        const url = `/api/set_user_rating?user_id=${user_id}&tconst=${_tconst}&rating=${_rating}&aiModel=${aiModel}`

        setRating(_rating)

        const response = await fetch(url)
        const ratingsCounts = await response.json()

        setRatingsCounts(ratingsCounts)
        console.log("Ratings -- result:", ratingsCounts)

        // Trouble with this, flashing.
        if (getData)
            await getData()

        // Generate recs every 10 ratings.
        if (ratingsCounts['rated'] % 10 == 0) {
            setIsLoading(true)
            const url = `/api/get_recommendations_async?user_id=${user_id}&rating=${_rating}&aiModel=${aiModel}`
            const response = await fetch(url)
            const result = await response.json()
            setIsLoading(false)
        }
    }

    // console.log("Ratings -- user_rating:", user_rating)
    const user_ratings = (
        <tr>
            <td style={{ verticalAlign: "top" }}>
                your rating
            </td>
            <td>
                <EditStarRating user_id={user_id} tconst={tconst}
                    user_rating={rating} getData={getData} dbSet={dbSet} />
            </td>
        </tr>
    )

    return (
        <div>
            <Spinner isLoading={isLoading.current} msg="please wait, generating recommendations" />
            <table><tbody>
                <tr>
                    <td>
                        imdb users
                    </td>
                    <td>
                        <StarRating score={averagerating} />
                    </td>
                </tr>

                {(user_id) ? user_ratings : null}
                <Interest
                    user_id={user_id}
                    tconst={tconst}
                    user_rating={rating}
                    dbSet={dbSet} />

            </tbody>
            </table>
        </div>
    )
})

export default Ratings