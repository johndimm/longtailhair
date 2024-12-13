import styles from "@/styles/Spinner.module.css"
import { useEffect, useState } from 'react'

const Spinner = ({ isLoading }) => {
    const [_isLoading, setIsLoading] = useState(isLoading)

    useEffect(() => {
        setIsLoading(isLoading)
        setTimeout( () =>  {
            setIsLoading(false)
        }, 10000 )
        // console.log("Spinner useEffect")
    }, [isLoading])

    if (!_isLoading) {
        return null;
    }
    else {
        return <div className={styles.spinner}>
            <img src="spinner.gif"/>
        </div>
    }
}

export default Spinner