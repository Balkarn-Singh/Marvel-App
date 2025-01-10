import React, { useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

function Home({
  setPlanOnReading,
  setCurrentlyReading,
  setCompleted,
  setLikedSeries,
  setLikedEvents,
  setPoints,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [comics, setComics] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreComics, setHasMoreComics] = useState(true);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [selectedComic, setSelectedComic] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("comics");
  const [series, setSeries] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedSearchType, setSelectedSearchType] = useState("comics");

  const handleSearch = async () => {
    setNoResults(false);
    if (selectedCategory !== "comics") setComics([]);
    if (selectedCategory !== "characters") setCharacters([]);
    if (selectedCategory !== "series") setSeries([]);
    if (selectedCategory !== "events") setEvents([]);
    setSelectedSearchType(selectedCategory);

    try {
      const endpoint =
        selectedCategory === "series"
          ? "/api/series"
          : selectedCategory === "events"
          ? "/api/events"
          : selectedCategory === "characters"
          ? "/api/characters"
          : "/api/comics";

      // Fetch character ID if searching for events
      let characterId = null;
      if (selectedCategory === "events" && searchQuery.trim()) {
        try {
          const characterResponse = await axios.get(
            "http://localhost:3001/api/characters",
            { params: { nameStartsWith: searchQuery.trim() } }
          );
          const foundCharacter = characterResponse.data.data.results.find(
            (char) => char.name.toLowerCase() === searchQuery.toLowerCase()
          );
          characterId = foundCharacter?.id || null;
        } catch (error) {
          console.error("Error fetching character ID:", error);
        }
      }

      const params =
        selectedCategory === "events"
          ? { characterId, nameStartsWith: searchQuery.trim() }
          : selectedCategory === "series" || selectedCategory === "comics"
          ? { titleStartsWith: searchQuery.trim() }
          : { nameStartsWith: searchQuery.trim() };

      const response = await axios.get(`http://localhost:3001${endpoint}`, {
        params,
      });

      const results = response.data.data.results || [];
      if (selectedCategory === "comics") {
        setComics(results);
      } else if (selectedCategory === "series") {
        setSeries(results);
      } else if (selectedCategory === "events") {
        setEvents(results);
      } else {
        setCharacters(results);
      }

      setNoResults(results.length === 0);
    } catch (error) {
      console.error(`Error fetching ${selectedCategory}:`, error);
    }
  };

  const handleComicClick = (comic) => {
    setSelectedComic(comic);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false); // Hide the modal
    setSelectedComic(null); // Clear the selected comic
  };

  const loadMoreComics = async () => {
    try {
      const nextPage = page + 1;
      const response = await axios.get(`http://localhost:3001/api/comics`, {
        params: {
          titleStartsWith: searchQuery.trim(),
          limit: 63,
          offset: (nextPage - 1) * 63, // Calculate offset for the next page
        },
      });

      const comicsData = response.data.data.results;
      setComics((prevComics) => [
        ...prevComics.filter(
          (comic) => !comicsData.some((newComic) => newComic.id === comic.id)
        ),
        ...comicsData,
      ]); // Append only unique comics
      setPage(nextPage);
      setHasMoreComics(comicsData.length === 63); // Check if more pages are available
    } catch (error) {
      console.error("Error loading more comics:", error);
    }
  };

  const loadMoreSeries = async () => {
    try {
      const nextPage = page + 1;
      const response = await axios.get(`http://localhost:3001/api/series`, {
        params: {
          titleStartsWith: searchQuery.trim(),
          limit: 20,
          offset: (nextPage - 1) * 20,
        },
      });
      const seriesData = response.data.data.results;
      setSeries((prevSeries) => [
        ...prevSeries,
        ...seriesData.filter(
          (newSerie) =>
            !prevSeries.some(
              (existingSerie) => existingSerie.id === newSerie.id
            )
        ),
      ]);

      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more series:", error);
    }
  };

  const loadMoreEvents = async () => {
    try {
      const nextPage = page + 1;
      const response = await axios.get(`http://localhost:3001/api/events`, {
        params: {
          nameStartsWith: searchQuery.trim(),
          limit: 20,
          offset: (nextPage - 1) * 20,
        },
      });
      const eventData = response.data.data.results;
      setEvents((prevEvents) => [
        ...prevEvents,
        ...eventData.filter(
          (newEvent) =>
            !prevEvents.some(
              (existingEvent) => existingEvent.id === newEvent.id
            )
        ),
      ]);

      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more events:", error);
    }
  };

  const debouncedFetchSuggestions = debounce((query) => {
    handleSuggestionsFetch(query);
  }, 100);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      debouncedFetchSuggestions(query);
    } else {
      setSuggestionsVisible(false); // Hide suggestions if the input is cleared
    }
  };

  const handleSuggestionsFetch = async (query) => {
    let endpoint = "/api/comics";
    let params = { nameStartsWith: query };

    if (selectedCategory === "events") {
      endpoint = "/api/events";
      params = { nameStartsWith: query };
    } else if (selectedCategory === "characters") {
      endpoint = "/api/characters";
      params = { nameStartsWith: query };
    } else if (selectedCategory === "series") {
      endpoint = "/api/series";
      params = { titleStartsWith: query };
    }

    const response = await axios.get(`http://localhost:3001${endpoint}`, {
      params,
    });

    const results = response.data.data.results;
    const suggestionsData =
      selectedCategory === "events"
        ? results.map((event) => event.title)
        : results.map((result) =>
            selectedCategory === "characters" ? result.name : result.title
          );

    setSuggestions(suggestionsData || []);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestionsVisible(false);
  };

  const addToList = (comic, listSetter, pointsSetter = null) => {
    if (typeof listSetter !== "function") {
      console.error("listSetter is not a function", listSetter);
      return;
    }
    listSetter((prevComics) => [...prevComics, comic]);
    setComics((prevComics) => prevComics.filter((c) => c.id !== comic.id));

    // Add 100 points if adding to completed
    if (listSetter === setCompleted && pointsSetter) {
      pointsSetter((prevPoints) => prevPoints + 100);
    }
  };

  const addToFavorites = (series) => {
    setLikedSeries((prev) => [...prev, series]);
    setSeries((prevSeries) => prevSeries.filter((s) => s.id !== series.id));
  };

  return (
    <div className="home">
      <h1>Marvel Comics Library</h1>
      <div className="search-container">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="comics">Comics</option>
          <option value="characters">Characters</option>
          <option value="series">Series</option>
          <option value="events">Events</option>
        </select>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setSuggestionsVisible(true)} // Show suggestions on focus
          onBlur={() => setSuggestionsVisible(false)} // Hide suggestions on blur
          placeholder={`Search ${selectedCategory}`}
        />

        <button onClick={handleSearch}>Search</button>
      </div>
      <div
        className={`suggestions-container ${
          suggestionsVisible ? "visible" : ""
        }`}
      >
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="suggestion-item"
            onMouseDown={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </div>
        ))}
      </div>
      {noResults && (
        <p className="no-results">
          No matching {selectedSearchType || "results"} found
        </p>
      )}
      <div className="comics-container">
        {comics.map((comic) => (
          <div key={comic.id} className="comic-item">
            <h3>{comic.title}</h3>
            <img
              src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
              alt={comic.title}
              onClick={() => handleComicClick(comic)} // Trigger modal on image click
            />
            <button onClick={() => addToList(comic, setPlanOnReading)}>
              Add to Plan on Reading
            </button>
            <button onClick={() => addToList(comic, setCurrentlyReading)}>
              Add to Currently Reading
            </button>
            <button onClick={() => addToList(comic, setCompleted, setPoints)}>
              Add to Completed
            </button>
          </div>
        ))}
        <div className="series-container">
          {series.map((serie) => (
            <div key={serie.id} className="series-item">
              <h3>{serie.title}</h3>
              <img
                src={`${serie.thumbnail.path}.${serie.thumbnail.extension}`}
                alt={serie.title}
              />
              <p>{serie.description || "No description available"}</p>
              <button onClick={() => addToFavorites(serie)}>
                Add to Favorites
              </button>
            </div>
          ))}
        </div>
        <div className="events-container">
          {events.map((event) => (
            <div key={event.id} className="event-item">
              <h3>{event.title}</h3>
              <img
                src={
                  event.thumbnail
                    ? `${event.thumbnail.path}.${event.thumbnail.extension}`
                    : "https://via.placeholder.com/200"
                }
                alt={event.title}
                className="event-thumbnail"
              />
              <p>{event.description || "No description available"}</p>
              <button
                onClick={() => {
                  const characters =
                    event.characters.items
                      .map((char) => char.name)
                      .join(", ") || "None";
                  const modal = document.createElement("div");
                  modal.className = "character-modal";
                  modal.innerHTML = `
                    <div class="modal-content">
                      <h2>Characters</h2>
                      <p>${characters}</p>
                      <button class="close-modal">Close</button>
                    </div>
                  `;
                  document.body.appendChild(modal);

                  modal
                    .querySelector(".close-modal")
                    .addEventListener("click", () => {
                      modal.remove();
                    });
                }}
              >
                Characters
              </button>

              <button
                onClick={() => {
                  if (typeof setLikedEvents === "function") {
                    setLikedEvents((prev) => [...prev, event]);
                    setEvents((prevEvents) =>
                      prevEvents.filter((e) => e.id !== event.id)
                    );
                  } else {
                    console.error(
                      "setLikedEvents is not defined or is not a function"
                    );
                  }
                }}
              >
                Add to Favorites
              </button>
            </div>
          ))}
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
        {selectedCategory === "comics" &&
          hasMoreComics &&
          comics.length > 0 && (
            <button onClick={loadMoreComics} className="load-more-button">
              Load More
            </button>
          )}
        {series.length > 0 && series.length % 20 === 0 && (
          <button onClick={loadMoreSeries} className="load-more-button">
            Load More
          </button>
        )}
        {events.length > 0 && events.length % 20 === 0 && (
          <button onClick={loadMoreEvents} className="load-more-button">
            Load More
          </button>
        )}
      </div>
      <div className="characters-container">
        {characters.map((character) => (
          <div key={character.id} className="character-item">
            <h3>{character.name}</h3>
            <img
              src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
              alt={character.name}
            />
            <p>{character.description || "No description available"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
