import styles from "@/styles/Spinner.module.css"
import { useEffect, useState } from 'react'

const Spinner = ({ isLoading, msg }) => {
    if (!isLoading) {
        return null;
    }
    else {
        return <div className={styles.spinner} title={msg}>
            <img src="spinner.gif"/>
            <div>{msg}</div>
        </div>
    }
}

export default Spinner