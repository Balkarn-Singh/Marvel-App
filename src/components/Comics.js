import React, { useState } from "react";

function Comics({
  currentlyReading = [],
  planOnReading = [],
  completed = [],
  setCurrentlyReading,
  setPlanOnReading,
  setCompleted,
  setPoints,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComic, setSelectedComic] = useState(null);

  const moveComic = (comic, fromListSetter, toListSetter, pointsChange = 0) => {
    fromListSetter((prevList) =>
      prevList.filter((item) => item.id !== comic.id)
    );
    toListSetter((prevList) => [...prevList, comic]);
    setPoints((prevPoints) => prevPoints + pointsChange); // Remove Math.max
  };

  const handleComicClick = (comic) => {
    setSelectedComic(comic);
    setModalVisible(true);
  };

  const removeFromList = (comic, setList) => {
    setList((prevList) => prevList.filter((item) => item.id !== comic.id));
    if (setPoints && completed.includes(comic)) {
      setPoints((prev) => Math.max(0, prev - 100)); // Deduct points, minimum 0
    }
  };

  const closeModal = () => {
    setSelectedComic(null);
    setModalVisible(false);
  };

  return (
    <div className="comics-page">
      <div className="reading-section">
        <h2>Currently Reading</h2>
        {currentlyReading.length > 0 ? (
          <div className="comics-container">
            {currentlyReading.map((comic) => (
              <div key={comic.id} className="comic-item">
                <h3>{comic.title}</h3>
                <img
                  src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                  alt={comic.title}
                  onClick={() => handleComicClick(comic)}
                />
                <button
                  onClick={() =>
                    moveComic(comic, setCurrentlyReading, setPlanOnReading)
                  }
                >
                  Move to Plan On Reading
                </button>
                <button
                  onClick={() =>
                    moveComic(comic, setCurrentlyReading, setCompleted, 100)
                  }
                >
                  Move to Completed
                </button>
                <button
                  onClick={() => removeFromList(comic, setCurrentlyReading)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No comics added</p>
        )}
      </div>

      <div className="reading-section">
        <h2>Plan On Reading</h2>
        {planOnReading.length > 0 ? (
          <div className="comics-container">
            {planOnReading.map((comic) => (
              <div key={comic.id} className="comic-item">
                <h3>{comic.title}</h3>
                <img
                  src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                  alt={comic.title}
                  onClick={() => handleComicClick(comic)}
                />
                <button
                  onClick={() =>
                    moveComic(comic, setPlanOnReading, setCurrentlyReading)
                  }
                >
                  Move to Currently Reading
                </button>
                <button
                  onClick={() =>
                    moveComic(comic, setPlanOnReading, setCompleted, 100)
                  }
                >
                  Move to Completed
                </button>
                <button onClick={() => removeFromList(comic, setPlanOnReading)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No comics added</p>
        )}
      </div>

      <div className="reading-section">
        <h2>Completed</h2>
        {completed.length > 0 ? (
          <div className="comics-container">
            {completed.map((comic) => (
              <div key={comic.id} className="comic-item">
                <h3>{comic.title}</h3>
                <img
                  src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                  alt={comic.title}
                  onClick={() => handleComicClick(comic)}
                />
                <button
                  onClick={() =>
                    moveComic(comic, setCompleted, setCurrentlyReading, -100)
                  }
                >
                  Move to Currently Reading
                </button>
                <button
                  onClick={() =>
                    moveComic(comic, setCompleted, setPlanOnReading, -100)
                  }
                >
                  Move to Plan On Reading
                </button>
                <button onClick={() => removeFromList(comic, setCompleted)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No comics added</p>
        )}
      </div>

      {modalVisible && selectedComic && (
        <div className="modal">
          <div className="modal-content">
            <button className="back-button" onClick={closeModal}>
              &larr; Back
            </button>
            <div className="comic-details">
              <div className="comic-image">
                <img
                  src={`${selectedComic.thumbnail.path}.${selectedComic.thumbnail.extension}`}
                  alt={selectedComic.title || "Comic Image"}
                />
              </div>
              <div className="comic-info">
                <h1>{selectedComic.title}</h1>
                <p>
                  <strong>Published:</strong>{" "}
                  {new Date(
                    selectedComic.dates.find(
                      (d) => d.type === "onsaleDate"
                    )?.date
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <strong>Writer:</strong>{" "}
                  {selectedComic.creators.items.find(
                    (creator) => creator.role === "writer"
                  )?.name || "N/A"}
                </p>
                <p>
                  <strong>Cover Artist:</strong>{" "}
                  {selectedComic.creators.items.find(
                    (creator) => creator.role === "penciller (cover)"
                  )?.name || "N/A"}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedComic.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Comics;
