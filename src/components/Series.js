function Series({ likedSeries, setLikedSeries }) {
  const removeFromFavorites = (series) => {
    setLikedSeries((prev) => prev.filter((item) => item.id !== series.id));
  };

  return (
    <div className="series-page">
      <h1>Liked Series</h1>
      <div className="series-container">
        {likedSeries.length > 0 ? (
          likedSeries.map((series) => (
            <div key={series.id} className="series-item">
              <h3>{series.title}</h3>
              <img
                src={`${series.thumbnail.path}.${series.thumbnail.extension}`}
                alt={series.title}
              />
              <p>{series.description || "No description available"}</p>
              <button onClick={() => removeFromFavorites(series)}>
                Remove from Favorites
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">No series added</p>
        )}
      </div>
    </div>
  );
}

export default Series;
