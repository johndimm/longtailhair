// "use client"
import { useState, useEffect } from 'react'
import styles from "@/styles/RangeSlider.module.css"
import { MIN_YEAR, MAX_YEAR } from "@/util/constants"

const RangeSlider = ({ min, max, leftFieldName, rightFieldName,
  changeYearstart, changeYearend, goLeft, goRight, yearstart, yearend, reset }) => {
  const [minval, setMinval] = useState()
  const [maxval, setMaxval] = useState()
  const [top, settop] = useState('min')

  const setBoth = (yearstart, yearend) => {
      //console.log("setBoth", yearstart, yearend)
    //if (yearstart) {
      setMinval(yearstart || MIN_YEAR)

      // should useRef for this.
      const minRange = document.getElementById('min_range_id')
      minRange.value = yearstart || MIN_YEAR
    //} 
    //if (yearend) {
      setMaxval(yearend || MAX_YEAR)

      const maxRange = document.getElementById('max_range_id')
      maxRange.value = yearend || MAX_YEAR
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
    // return
    const val = e.target.value
    
    setMinval(val)
    if (minval >= maxval) {
      setMaxval(val)
      settop('min')
    }
    console.log("newStart: ", val)
    return

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
    console.log("updateStart and end", val)

    //if (val <= maxval) {
      //setMaxval(val)
      setMinval(val)
      changeYearstart(e)
      if (minval == maxval)
        changeYearend(e)
      settop('max')
    //}
  }

  const updateEnd = (e) => {
    const val = e.target.value
     console.log("updateEnd", val)
    if (val <= maxval) {
      setMaxval(val)
      changeYearend(e)
      if (minval == maxval)
        settop('min')
    }
  }

  const newEnd = (e) => {
    //return
    const val = e.target.value

    if (val < minval) {
      setBoth(minval, minval)
    } else {
      setMaxval(val)
    }
    return

    // console.log("newEnd", val)
    if (val >= minval) {
      setMaxval(val)
    }
  }

  const onMouseMove = (e) => {
    const offsetX = e.nativeEvent.offsetX
    
    console.log("onMouseMove: ", offsetX)
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

  const defaultMax = yearend || MAX_YEAR
  const defaultMin = yearstart || MIN_YEAR
  // console.log(`defaultMax=${defaultMax} defaultMin=${defaultMin}`)

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

  const minZstyle = {"zIndex": top == 'min' ? 10 : 1, "display": "block"}
  const maxZstyle = {"zIndex": 5, "display": top != 'min' || minval != maxval ? "block" :  "none"}

  //console.log(`minVal=${minval} maxVal=${maxval}`)

  return (
    <div className={styles.range}>

      <div className={styles.range_slider}>
        <span className={styles.range_selected} style={fillBlueStyle}></span>
      </div>

      <div className={styles.range_input}
        >

      <span className={styles.max_date_range}>
      <input  id='max_range_id' type="range"
          min={MIN} max={MAX}
          defaultValue={defaultMax} step="1"
          onChange={newEnd}
          onMouseUp={updateEnd}
          onTouchEnd={updateEnd}
          style={maxZstyle}
        />
        </span>

        <input id='min_range_id' type="range"
          min={MIN} max={MAX}
          defaultValue={defaultMin} step="1"
          onChange={newStart}
          onMouseUp={updateStart}
          onTouchEnd={updateStart}
          style={minZstyle}
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