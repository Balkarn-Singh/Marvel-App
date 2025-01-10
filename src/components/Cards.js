import React, { useState, useEffect } from "react";
import axios from "axios";

function Cards({ points, setPoints }) {
  const [cardPack, setCardPack] = useState([]);
  const [collection, setCollection] = useState(() => {
    const savedCollection = localStorage.getItem("collection");
    return savedCollection ? JSON.parse(savedCollection) : [];
  });

  useEffect(() => {
    localStorage.setItem("collection", JSON.stringify(collection));
  }, [collection]);

  const openPack = async () => {
    if (points < 100) {
      alert("Not enough points to open a pack!");
      return;
    }

    setPoints((prev) => prev - 100);

    try {
      const response = await axios.get(
        "http://localhost:3001/api/random-characters"
      );
      setCardPack(response.data.data.results);
    } catch (error) {
      console.error("Error opening pack:", error);
    }
  };

  const addToCollection = (card) => {
    setCollection((prev) => [...prev, card]);
    setCardPack((prev) => prev.filter((c) => c.id !== card.id));
  };

  const recycleCard = (card, isFromCollection = false) => {
    setPoints((prev) => prev + 10);
    if (isFromCollection) {
      setCollection((prev) => prev.filter((c) => c.id !== card.id));
    } else {
      setCardPack((prev) => prev.filter((c) => c.id !== card.id));
    }
  };

  return (
    <div className="cards-page">
      <h1>Cards</h1>
      <button onClick={openPack}>Open Pack (100 Points)</button>
      <div className="card-pack">
        {cardPack.map((card) => (
          <div key={card.id} className="card-item">
            {card.thumbnail ? (
              <img
                src={`${card.thumbnail.path}.${card.thumbnail.extension}`}
                alt={card.name}
                className="card-image"
              />
            ) : (
              <div className="card-placeholder">No Image Available</div>
            )}
            <h3>{card.name}</h3>
            <p>{card.description || "No description available."}</p>
            <button onClick={() => addToCollection(card)}>
              Add to Collection
            </button>
            <button onClick={() => recycleCard(card)}>
              Recycle (+10 Points)
            </button>
          </div>
        ))}
      </div>

      <h2>Collection</h2>
      <div className="collection">
        {collection.map((card) => (
          <div key={card.id} className="card-item">
            {card.thumbnail ? (
              <img
                src={`${card.thumbnail.path}.${card.thumbnail.extension}`}
                alt={card.name}
                className="card-image"
              />
            ) : (
              <div className="card-placeholder">No Image Available</div>
            )}
            <h3>{card.name}</h3>
            <p>{card.description || "No description available."}</p>
            <button onClick={() => recycleCard(card, true)}>
              Recycle (+10 Points)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cards;
