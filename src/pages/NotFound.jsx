import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, AlertCircle } from 'lucide-react'

function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
            <AlertCircle size={48} className="text-accent" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-surface-600 dark:text-surface-300 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound