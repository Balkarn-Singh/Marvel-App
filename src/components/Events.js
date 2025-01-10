import React from "react";

function Events({ likedEvents, setLikedEvents }) {
  const removeFromFavorites = (event) => {
    setLikedEvents((prev) => prev.filter((item) => item.id !== event.id));
  };

  return (
    <div className="events-page">
      <h1>Liked Events</h1>
      <div className="events-container">
        {likedEvents.length > 0 ? (
          likedEvents.map((event) => (
            <div key={event.id} className="event-item">
              <h3>{event.title}</h3>
              <img
                src={
                  event.thumbnail
                    ? `${event.thumbnail.path}.${event.thumbnail.extension}`
                    : "https://via.placeholder.com/250"
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
              <button onClick={() => removeFromFavorites(event)}>
                Remove from Favorites
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">No events added</p>
        )}
      </div>
    </div>
  );
}

export default Events;
