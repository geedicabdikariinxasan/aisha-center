import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Classes from './pages/Classes';

function App() {
  return (
    <Router>
      <Routes>
        {/* Halkan: Marka qofku galo link-ga weyn, wuxuu toos u arkaa Login isagoo aan URL-ka waxba ku darin */}
        <Route path="/" element={<Login />} />
        
        {/* Haddii aad rabto in /login laftiisu uu shaqeeyo waad ku deyn kartaa */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/classes" element={<Classes />} />
      </Routes>
    </Router>
  );
}

export default App;