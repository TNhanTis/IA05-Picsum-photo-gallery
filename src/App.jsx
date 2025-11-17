import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PhotoList from "./components/PhotoList";
import PhotoDetail from "./components/PhotoDetail";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/photos" replace />} />
        <Route path="/photos" element={<PhotoList />} />
        <Route path="/photos/:id" element={<PhotoDetail />} />
        <Route path="*" element={<Navigate to="/photos" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
