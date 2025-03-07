import React from "react";
import { Routes, Route } from "react-router-dom";
import Weather from "./Weather";

const App = () => {
  return (
    <Routes>
      <Route path="/weather/:lat/:lon" element={<Weather />} />
    </Routes>
  );
};

export default App;
