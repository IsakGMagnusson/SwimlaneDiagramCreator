import { Routes, Route } from "react-router-dom";
import Swimlane from "./pages/Mainpage";
import React, { useEffect, useState } from "react";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Swimlane />} />
      </Routes>
    </div>
  );
}

export default App;
