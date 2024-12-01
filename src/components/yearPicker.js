
import React, { useState, useContext, useEffect } from 'react'
import RangeSlider from '@/components/RangeSlider'


const YearPicker = ({
  setParentYearstart, setParentYearend, yearstart, yearend, goLeft, goRight
}) => {
  const minDate = 1890
  const maxDate = 2030
  const initialStart = 2024
  const initialEnd = 2024

  useEffect(() => {
    setParentYearstart(initialStart)
    setParentYearend(initialEnd)
  }, [])

  const reset = () => {
    setParentYearstart(null)
    setParentYearend(null)
  }

  const sliderWasMoved = (start, end) => {
    return start != initialStart || end != initialEnd
  }
  const changeYearstart = (e) => {
    const newYearstart = e.target.value
    if (newYearstart.length == 4) {
      if (sliderWasMoved(newYearstart, yearend)) {
        setParentYearstart(newYearstart)
      } else {
        reset()
      }
    }
  }

  const changeYearend = (e) => {
    const newYearend = e.target.value
    if (newYearend.length == 4) {
      if (sliderWasMoved(yearstart, newYearend)) {
        setParentYearend(newYearend)
      } else {
        reset()
      }
    }
  }

  return <RangeSlider
    min={minDate} max={maxDate} leftFieldName="" rightFieldName="to"
    changeYearstart={changeYearstart}
    changeYearend={changeYearend}
    goLeft={goLeft}
    goRight={goRight}
    yearstart={yearstart}
    yearend={yearend}
    reset={reset}
  />
}

export default YearPicker