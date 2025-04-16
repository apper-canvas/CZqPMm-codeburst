import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : 
      window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border-b border-surface-200 dark:border-surface-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              CB
            </div>
            <h1 className="text-xl font-bold">
              Code<span className="text-primary">Burst</span>
            </h1>
          </div>
          
          <button 
            onClick={toggleDarkMode}
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
      </header>
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <footer className="bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-surface-500">
          <p>© {new Date().getFullYear()} CodeBurst. Start your JavaScript journey today.</p>
        </div>
      </footer>
    </div>
  )
}

export default App