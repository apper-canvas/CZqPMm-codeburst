import { createContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';

import Home from './pages/Home'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get authentication status
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : 
      window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const initializeApper = async () => {
      try {
        const { ApperClient, ApperUI } = window.ApperSDK;
        const client = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        
        // Initialize but don't show login yet
        ApperUI.setup(client, {
          target: '#authentication',
          clientId: import.meta.env.VITE_APPER_PROJECT_ID,
          view: 'both',
          onSuccess: function (user) {
            // CRITICAL: This exact currentPath logic must be preserved in all implementations
            // DO NOT simplify or modify this pattern as it ensures proper redirection flow
            let currentPath = window.location.pathname + window.location.search;
            let redirectPath = new URLSearchParams(window.location.search).get('redirect');
            const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
                '/callback') || currentPath.includes('/error');
            if (user) {
              // User is authenticated
              if (redirectPath) {
                navigate(redirectPath);
              } else if (!isAuthPage) {
                if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                  navigate(currentPath);
                } else {
                  navigate('/dashboard');
                }
              } else {
                navigate('/dashboard');
              }
              // Store user information in Redux
              dispatch(setUser(JSON.parse(JSON.stringify(user))));
            } else {
              // User is not authenticated
              if (!isAuthPage) {
                navigate(
                  currentPath.includes('/signup')
                   ? `/signup?redirect=${currentPath}`
                   : currentPath.includes('/login')
                   ? `/login?redirect=${currentPath}`
                   : '/login');
              } else if (redirectPath) {
                if (
                  ![
                    'error',
                    'signup',
                    'login',
                    'callback'
                  ].some((path) => currentPath.includes(path)))
                  navigate(`/login?redirect=${redirectPath}`);
                else {
                  navigate(currentPath);
                }
              } else if (isAuthPage) {
                navigate(currentPath);
              } else {
                navigate('/login');
              }
              dispatch(clearUser());
            }
          },
          onError: function(error) {
            console.error("Authentication failed:", error);
            navigate('/error?message=' + encodeURIComponent(error.message || 'Authentication failed'));
          }
        });
        
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize Apper:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApper();
  }, [dispatch, navigate]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    isAuthenticated,
    user: userState?.user,
    logout: async () => {
      try {
        setIsLoading(true);
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        setIsLoading(false);
      }
    },
    toggleDarkMode: () => setDarkMode(prev => !prev)
  };
  
  // Don't render routes until initialization is complete
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" aria-label="Loading"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border-b border-surface-200 dark:border-surface-800">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                CB
              </div>
              <h1 className="text-2xl font-bold">
                <span className="text-gradient">CodeBurst</span>
                <span className="text-xs ml-2 text-surface-500 dark:text-surface-400 font-normal">Learn JavaScript from Zero</span>
              </h1>
            </Link>
            
            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <button onClick={authMethods.logout} className="btn btn-outline text-sm">
                  Logout
                </button>
              )}
              
              <button 
                onClick={authMethods.toggleDarkMode}
                className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={darkMode ? 'dark' : 'light'}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <footer className="bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 py-4">
          <div className="container mx-auto px-4 text-center text-sm text-surface-500">
            <p>© {new Date().getFullYear()} CodeBurst. Learn JavaScript from Zero.</p>
          </div>
        </footer>

        {/* Hidden div for ApperUI authentication */}
        <div id="authentication" className="hidden"></div>
      </div>
    </AuthContext.Provider>
}

export default App;