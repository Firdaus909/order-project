import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import { AuthContext } from './AuthContext';

import './App.css';

const App = () => {
  const { isAuth } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            isAuth ? (
              <Navigate to='/dashboard' replace />
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
        <Route
          path='/login'
          element={isAuth ? <Navigate to='/dashboard' replace /> : <Login />}
        />
        <Route
          path='/register'
          element={isAuth ? <Navigate to='/dashboard' replace /> : <Register />}
        />
        <Route
          path='/forgot-password'
          element={
            isAuth ? <Navigate to='/dashboard' replace /> : <ForgotPassword />
          }
        />
        <Route
          path='/dashboard'
          element={isAuth ? <Dashboard /> : <Navigate to='/login' replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
