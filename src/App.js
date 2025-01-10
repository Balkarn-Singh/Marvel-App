import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import Home from "./components/Home";
import Comics from "./components/Comics";
import Series from "./components/Series";
import Events from "./components/Events";
import Cards from "./components/Cards";
import ComicDetails from "./components/ComicDetails";
import "./App.css";

function App() {
  const [planOnReading, setPlanOnReading] = useState([]);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [likedSeries, setLikedSeries] = useState([]);
  const [likedEvents, setLikedEvents] = useState([]);
  const [points, setPoints] = useState(0);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <Router>
      <div className={`App ${darkMode ? "dark-mode" : ""}`}>
        <nav>
          <NavLink to="#" className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/comics"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Comics
          </NavLink>
          <NavLink
            to="/series"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Series
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Events
          </NavLink>
          <NavLink
            to="/cards"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Cards
          </NavLink>
          <NavLink to="#" className="points-display">
            Points: {points}
          </NavLink>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                setPlanOnReading={setPlanOnReading}
                setCurrentlyReading={setCurrentlyReading}
                setCompleted={setCompleted}
                setLikedSeries={setLikedSeries}
                setLikedEvents={setLikedEvents}
                setPoints={setPoints}
              />
            }
          />
          <Route path="/comic/:comicId" element={<ComicDetails />} />{" "}
          <Route
            path="/comics"
            element={
              <Comics
                currentlyReading={currentlyReading}
                planOnReading={planOnReading}
                completed={completed}
                setCurrentlyReading={setCurrentlyReading}
                setPlanOnReading={setPlanOnReading}
                setCompleted={setCompleted}
                setPoints={setPoints}
              />
            }
          />
          <Route
            path="/series"
            element={
              <Series
                likedSeries={likedSeries}
                setLikedSeries={setLikedSeries}
              />
            }
          />
          <Route
            path="/events"
            element={
              <Events
                likedEvents={likedEvents}
                setLikedEvents={setLikedEvents}
              />
            }
          />
          <Route
            path="/cards"
            element={<Cards points={points} setPoints={setPoints} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
