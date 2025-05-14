import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'
import { Code, Terminal, BookOpen, ChevronRight } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { useContext } from 'react';
import { AuthContext } from '../App';
import { fetchSteps } from '../store/tutorialSlice';

function Home() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useContext(AuthContext);
  const [tutorialCount, setTutorialCount] = useState(0);
  
  useEffect(() => {
    // Load tutorial count from the backend
    const loadTutorialCount = async () => {
      try {
        const steps = await dispatch(fetchSteps()).unwrap();
        setTutorialCount(steps.length);
      } catch (error) {
        console.error("Failed to load tutorial count:", error);
        setTutorialCount(4); // Fallback count
      }
    };
    
    loadTutorialCount();
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
            Learn JavaScript <span className="text-gradient">from Zero</span>
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Learn JavaScript <span className="text-gradient">Step by Step</span>
          </h1>
          <p className="text-lg text-surface-600 dark:text-surface-300 mb-8">
            Start your coding journey with the classic "Hello World" example and build your skills through interactive lessons.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-100 dark:bg-surface-800 rounded-full">
              <Code size={18} className="text-primary" />
              <span>Interactive Code Editor</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-100 dark:bg-surface-800 rounded-full">
              <Terminal size={18} className="text-secondary" />
              <span>Live Output</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-100 dark:bg-surface-800 rounded-full">
              <BookOpen size={18} className="text-accent" />
              <span>Step-by-Step Guidance</span>
            </div>
          </div>
        </motion.div>
      </section>
      
export default Home;
      <section className="mb-12 max-w-4xl mx-auto">
        <div className="card p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-surface-600 dark:text-surface-300 mb-6">
            Our structured JavaScript curriculum takes you from beginner to confident developer through {tutorialCount} interactive lessons.
          </p>
          
          <div className="flex justify-center">
            <Link 
              to={isAuthenticated ? "/dashboard" : "/signup"} 
              className="btn btn-primary flex items-center gap-2"
            >
              {isAuthenticated ? "Continue Learning" : "Sign Up & Start Learning"}
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home