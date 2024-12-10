import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import App from './App';
import Najemnici from './pages/Najemnici';
import Jednotky from './pages/Jednotky';
import Predpisy from './pages/Predpisy';
import Platby from './pages/Platby';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>} />
          <Route path="/najemnici" element={<ProtectedRoute><Najemnici /></ProtectedRoute>} />
          <Route path="/jednotky" element={<ProtectedRoute><Jednotky /></ProtectedRoute>} />
          <Route path="/predpisy" element={<ProtectedRoute><Predpisy /></ProtectedRoute>} />
          <Route path="/platby" element={<ProtectedRoute><Platby /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  </StrictMode>
);