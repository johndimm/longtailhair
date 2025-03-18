import React, { useState, useEffect, useRef } from 'react'
import styles from "@/styles/Main.module.css"

const RequestRecs = ({ generateRecs, buttonText, user, style }) => {
  const [counter, setCounter] = useState(0)
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current); // Clear interval on unmount
  }, []);

  const generate = async (e) => {
    e.preventDefault()

    intervalRef.current = setInterval(() => {
      setCounter(prevCount => prevCount + 1);
    }
      , 1000)
    await generateRecs()
    return () => clearInterval(intervalRef.current)
  }

  const count = counter > 0 ? counter : null

  if (!style) style = {}

  return (
    <div className={styles.request_recs}>
      <button style={style} onClick={generate} disabled={!user.id}>{buttonText}</button> {count}
    </div>
  )
}

export default RequestRecs
