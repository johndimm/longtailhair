import { useContext, useState, useEffect } from 'react'
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
        console.log("useEffect, defaultNstars:", defaultNstars, " nStars:", nStars, " tconst:", tconst)
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
        console.log("mouseOut:", e.target.id)
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


const Ratings = (({ user_id, tconst, user_rating, averagerating, getData, aiModel }) => {
    // const [rating, setRating] = useState(user_rating)
    const rating = user_rating

    const parameters = useContext(StateContext)
    const { setNumRatings } = parameters.setters
    const { numRatings } = parameters.values

    //useEffect(() => {
    //  setRating(user_rating)
    //}, [tconst])

    const [isLoading, setIsLoading] = useState(false)

    // console.log(`Ratings tconst:${tconst}, user_rating:${user_rating}, rating:${rating}`)

    const dbSet = async (user_id, _tconst, _rating) => {
        // User gave a rating.
        const url = `/api/set_user_rating?user_id=${user_id}&tconst=${_tconst}&rating=${_rating}&aiModel=${aiModel}`

        const response = await fetch(url)
        const result = await response.json()

        // setRating(_rating)
        setNumRatings(parseInt(numRatings) + 1)
        /*
                if (result.count % 10 == 0) {
                    setIsLoading(true)
                    const url = `/api/get_recommendations?user_id=${user_id}&rating=${_rating}&aiModel=${aiModel}`
                    const response = await fetch(url)
                    const result = await response.json()
                    setIsLoading(false)
                }
        */
        if (getData)
            getData()

    }

    //const interested = user_rating == -1
    //const not_interested = user_rating == -2
    const interested_id = 'interested-' + tconst
    const not_interested_id = 'not-interested-' + tconst
    const interest_level_name = 'interest-' + tconst

    console.log("Ratings -- rating:", rating, " user_rating:", user_rating)
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

    const interest = (
        <tr>
            <td style={{ verticalAlign: "top" }}>
                want to see?
            </td>
            <td>
                <label htmlFor={not_interested_id}>
                    <input id={not_interested_id} name={interest_level_name} type='radio'
                        defaultChecked={rating == -2}

                        onChange={() => dbSet(user_id, tconst, -2)} />
                    no
                </label>

                <label htmlFor={interested_id}>
                    <input id={interested_id} name={interest_level_name} type='radio'
                        defaultChecked={rating == -1}

                        onChange={() => dbSet(user_id, tconst, -1)} />
                    yes
                </label>
            </td>
        </tr>
    )

    return (
        <div>
            <Spinner isLoading={isLoading} msg="please wait, generating recommendations" />
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
                {(user_id) ? interest : null}

            </tbody>
            </table>
        </div>
    )
})

export default Ratings