import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import NewStory from "./pages/NewStory";
import StoryPage from "./pages/StoryPage";
import StoriesList from "./pages/StoriesList";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new-story" element={<NewStory />} />
            <Route path="/stories" element={<StoriesList />} />
            <Route path="/story/:storyId" element={<StoryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
