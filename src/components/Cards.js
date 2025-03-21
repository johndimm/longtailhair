import Card from '@/components/Card'

const Cards = ({
    data,
    place,
    selectedPerson,
    theme,
    getData
  }) => {
  
    // Aggregate multiple actors in the same film.
    const agg = {}
    data.filter(r => r.place == place).forEach((r, idx) => {
      const movie = r.tconst
      if (!(movie in agg)) {
        agg[movie] = []
      }
      agg[movie].push(r)
    })
  
    return Object.keys(agg).map((tconst, idx) => {
      const recs = agg[tconst]
  
      return <Card
        key={idx}
        recs={recs}
        selectedPerson={selectedPerson}
        position="sidebar"
        theme={theme}
        getData={getData} />
  
    })
  }

  export default Cards