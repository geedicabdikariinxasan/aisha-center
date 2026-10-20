import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Students from './pages/Students'; // <--- Hubi inaa import gareysay Students
import Teachers from './pages/Teachers'; // <--- Hubi inaa import gareysay
import Classes from './pages/Classes';
// import Classes from './pages/Classes'; // Wixii kale ee soo socda

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Labada Route-ba waa la isku xiray si uusan Error u keenin */}
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/students" element={<Students />} /> {/* <--- Route-ka Students */} 
        <Route path="/teachers" element={<Teachers />} /> {/* <--- Route-ka Teachers */}
         <Route path="/classes" element={<Classes />} /> {/* <--- Route-ka Classes */}
      </Routes>
    </Router>
  );
}

export default App;