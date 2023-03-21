import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StoryList from "./components/StoryList";
import RawJSON from "./components/RawJSON";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<StoryList />} />
          <Route path="/story" element={<RawJSON />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
