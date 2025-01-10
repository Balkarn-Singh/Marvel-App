import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ComicDetails() {
  const { comicId } = useParams(); // Get comicId from the route
  const [comic, setComic] = useState(null);
  const navigate = useNavigate(); // For back navigation

  useEffect(() => {
    const fetchComicDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/comics`, {
          params: { comicId },
        });
        const comicData = response.data.data.results[0]; // Fetch the first comic
        setComic(comicData);
      } catch (error) {
        console.error("Error fetching comic details:", error);
      }
    };

    fetchComicDetails();
  }, [comicId]);

  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!comic) {
    return <p>Loading comic details...</p>;
  }

  const { title, description, thumbnail, creators, dates, urls } = comic;

  const onsaleDate = dates.find((date) => date.type === "onsaleDate")?.date;
  const writer =
    creators.items.find((creator) => creator.role === "writer")?.name || "N/A";
  const coverArtist =
    creators.items.find((creator) => creator.role === "penciller (cover)")
      ?.name || "N/A";
  const detailUrl = urls.find((url) => url.type === "detail")?.url || "#";

  return (
    <div className="comic-details">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <div className="comic-image">
        <img src={`${thumbnail.path}.${thumbnail.extension}`} alt={title} />
      </div>
      <div className="comic-info">
        <h1>{title}</h1>
        <p>
          <strong>Published:</strong>{" "}
          {onsaleDate ? formatDate(onsaleDate) : "N/A"}
        </p>
        <p>
          <strong>Writer:</strong> {writer}
        </p>
        <p>
          <strong>Cover Artist:</strong> {coverArtist}
        </p>
        <p>
          <strong>Description:</strong>{" "}
          {description || "No description available."}
        </p>
        <a href={detailUrl} target="_blank" rel="noopener noreferrer">
          <button className="more-info-button">More Info</button>
        </a>
      </div>
    </div>
  );
}

export default ComicDetails;
