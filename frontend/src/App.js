import React, {useState, useEffect, useRef} from 'react';
import { Route, Routes, Navigate} from 'react-router-dom'
import Home from './components/Home';
import TestFlight from './components/TestFlight/TestFlight';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/test" element={<TestFlight />} />
    </Routes>
  );
}

export default App;
