import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isInitialized } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      // Redirect to login with the current path for redirect after login
      navigate(`/login?redirect=${location.pathname}${location.search}`);
    }
  }, [isAuthenticated, isInitialized, navigate, location]);
  
  // If not initialized yet, show loading
  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center"><div className="loading-spinner"></div></div>;
  }
  
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;