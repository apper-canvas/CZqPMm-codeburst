import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8 text-surface-600 dark:text-surface-300">Page not found</p>
      
      <div className="max-w-md text-center mb-8">
        <p className="mb-6">The page you are looking for doesn't exist or has been moved.</p>
        
        <Link to="/" className="btn btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} />
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;