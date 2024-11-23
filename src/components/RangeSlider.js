"use client"
import { useState, useEffect } from 'react'
import styles from "@/styles/RangeSlider.module.css";

const RangeSlider = ({ min, max, leftFieldName, rightFieldName,
  changeYearstart, changeYearend, goLeft, goRight, yearstart, yearend, reset }) => {
  const [minval, setMinval] = useState(yearstart || min)
  const [maxval, setMaxval] = useState(yearend || max)

  const setBoth = (yearstart, yearend) => {
    //if (yearstart) {
      setMinval(yearstart || min)

      // should useRef for this.
      const minRange = document.getElementById('min_range_id')
      minRange.value = yearstart || min
    //} 
    //if (yearend) {
      setMaxval(yearend || max)

      const maxRange = document.getElementById('max_range_id')
      maxRange.value = yearend || max
    //}
  }

  useEffect(() => {
    setBoth(yearstart, yearend)
  }, [yearstart, yearend])

  const clear = (e) => {
    reset ()
    setBoth(min, max)
  }

  const newStart = (e) => {
    const val = e.target.value
    if (val > maxval) {
      setBoth(maxval, maxval)
    }
    //console.log("newStart", val)

    if (val <= maxval) {
      setMinval(val)
    }
  }

  const updateStart = (e) => {
    const val = e.target.value
    console.log("updateStart", val)

    if (val <= maxval) {
      setMinval(val)
      changeYearstart(e)
    }
  }

  const updateEnd = (e) => {
    const val = e.target.value
    // console.log("updateEnd", val)
    if (val <= maxval) {
      setMaxval(val)
      changeYearend(e)
    }
  }

  const newEnd = (e) => {
    const val = e.target.value
    if (val < minval) {
      setBoth(minval, minval)
    }

    // console.log("newEnd", val)
    if (val >= minval) {
      setMaxval(val)
    }
  }

  const MIN = parseInt(min)
  const MAX = parseInt(max)

  const r = MAX - MIN
  const left = ((minval - MIN) * 100 / r)
  const right = 100 - ((maxval - MIN) * 100 / r) 

  const fillBlueStyle = {
    left: left + "%",
    right: right + "%"
  }
  // console.log(`yearstart=${yearstart} min=${min} yearend=${yearend} max=${max}`)

  const defaultMax = yearend || MAX
  const defaultMin = yearstart || MIN
  console.log(`defaultMax=${defaultMax} defaultMin=${defaultMin}`)

  const clearButton = yearstart || yearend
    ? <div className={styles.clear_button} onClick={clear}>clear</div>
    : <></>

  const rangeEndpoints = minval != maxval
     ? (<>
     {leftFieldName}&nbsp;
    <span className={styles.year}>{minval}</span>
    {rightFieldName}&nbsp;
    <span className={styles.year}>{maxval}</span> 
  </>)
    : <div className={styles.year} style={{fontSize: "150%"}}>{minval}</div>   


  return (
    <div className={styles.range}>

      <div className={styles.range_slider}>
        <span className={styles.range_selected} style={fillBlueStyle}></span>
      </div>
      <div className={styles.range_input}>

      <input id='max_range_id' type="range"
          min={MIN} max={MAX}
          defaultValue={defaultMax} step="1"
          onChange={newEnd}
          onMouseUp={updateEnd}
          onTouchEnd={updateEnd}
        />

        <input id='min_range_id' type="range"
          min={MIN} max={MAX}
          defaultValue={defaultMin} step="1"
          onChange={newStart}
          onMouseUp={updateStart}
          onTouchEnd={updateStart}
        />

      </div>

      <div className={styles.range_year}>

        <span
          onClick={goLeft}
          className={styles.date_left_arrow}>&#10148;
        </span>

        {rangeEndpoints}

        <span
          onClick={goRight}
          className={styles.date_right_arrow} >&#10148;
        </span>

      </div>

    </div>
  )
}

export default RangeSlider