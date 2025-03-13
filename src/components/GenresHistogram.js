import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from '@/styles/GenresHistogram.module.css';

// Sample data structure for testing
const sampleData = [
  {genre: "Action", count: 45882},
  {genre: "Comedy", count: 102633},
  {genre: "Drama", count: 220416},
  {genre: "Horror", count: 30693},
  {genre: "Romance", count: 46375}
];

const GenresHistogram = ({ initialData = sampleData, initialGenres, resetGenres }) => {
  const [data, setData] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Process initial data from props
  useEffect(() => {
    const processData = () => {
      try {
        // Always use data from props
        let genreData = initialData || [];
        
        // Sort alphabetically by genre name
        genreData.sort((a, b) => a.genre.localeCompare(b.genre));
        
        setData(genreData);
        setSelectedGenres(initialGenres)
        setLoading(false);
      } catch (err) {
        console.error('Error processing genre data:', err);
        setLoading(false);
      }
    };
    
    processData();
  }, [initialData]);

  const resetSelectedGenres = (genres) => {
    setSelectedGenres(genres)
    resetGenres(genres.join(','))
  }
  
  // Handle genre selection
  const handleBarClick = (entry) => {
    const genre = entry.genre;
    
    // Add or remove from selected genres.  
    if (selectedGenres.includes(genre)) {
      resetSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      // Only allow up to 3 selections.  Do not allow 
      // selection of empty genres.
      if (selectedGenres.length < 3 
           && initialData.find ( (g) => g.genre == genre && g.count > 0)
        ) {
        resetSelectedGenres([...selectedGenres, genre]);
      }
    }
  };
  
  // Custom bar to ensure minimum size and handle clicks
  const CustomBar = (props) => {
    const { x, y, width, height, fill, dataKey, payload } = props;
    
    // Ensure minimum height of 2px for visibility
    const minHeight = 2;
    const displayHeight = height < minHeight && height > 0 ? minHeight : height;
    const adjustedY = (y || 0) + (height - displayHeight);
    
    // Determine if this genre is selected
    const isSelected = selectedGenres.includes(payload.genre);
    const barFill = isSelected ? "#ff7f0e" : "#8884d8";
    
    return (
      <g>
        <rect
          x={x}
          y={adjustedY}
          width={width}
          height={displayHeight}
          fill={barFill}
          className={styles.genreBar}
          onClick={() => handleBarClick(payload)}
          rx={1}
          ry={1}
        />
      </g>
    );
  };
  
  if (loading) return <div className={styles.genreLoading}>Loading genre data...</div>;
  
  return (
    <div className={styles.genreContainer}>
      
      <div className={styles.genreSelectionArea}>
        {selectedGenres.length > 0 ? (
          <div className={styles.genreTags}>
            {selectedGenres.map(genre => (
              <span key={genre} className={styles.genreTag}>
                {genre}
                <button 
                  className={styles.genreTagRemove}
                  onClick={() => resetSelectedGenres(selectedGenres.filter(g => g !== genre))}
                  aria-label={`Remove ${genre}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className={styles.genreEmptySelection}>
            Click bars to select up to 3 genres
          </div>
        )}
      </div>
      
      <div className={styles.genreChartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 20, bottom: 30 }}
            barCategoryGap="10%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="genre"
              interval={0}
              tick={props => {
                const { x, y, payload } = props;
                // Check if this genre is selected
                const isSelected = selectedGenres.includes(payload.value);
                const labelClass = isSelected ? `${styles.genreLabel} ${styles.selected}` : styles.genreLabel;
                
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={10}
                      textAnchor="end"
                      className={labelClass}
                      transform="rotate(-45)"
                      onClick={() => handleBarClick({ genre: payload.value })}
                    >
                      {payload.value}
                    </text>
                  </g>
                );
              }}
              height={45}
            />
            <YAxis width={0} />
            <Tooltip 
              formatter={(value) => `${value}`} //[value.toLocaleString(), '']}
              labelFormatter={(label) => `genre: ${label}`}
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            />
            <Bar 
              dataKey="count" 
              name="shows" 
              shape={<CustomBar />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
    </div>
  );
};

export default GenresHistogram;