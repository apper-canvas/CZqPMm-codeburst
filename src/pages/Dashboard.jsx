import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useContext } from 'react';
import { format } from 'date-fns';
import { ChevronRight, BookOpen, CheckCircle, Award, Clock } from 'lucide-react';
import { fetchSteps, setCurrentStep, fetchUserProgress } from '../store/tutorialSlice';
import { updateUserProgress } from '../services/userProgressService';
import { AuthContext } from '../App';
import MainFeature from '../components/MainFeature';

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [progressRecord, setProgressRecord] = useState(null);
  
  const { steps, currentStepIndex, completedSteps } = useSelector((state) => state.tutorial);
  
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Load tutorial steps
        await dispatch(fetchSteps()).unwrap();
        
        // Load user progress if user is authenticated
        if (user && user.userId) {
          const progressData = await dispatch(fetchUserProgress(user.userId)).unwrap();
          setProgressRecord(progressData);
          
          // Set current step from user progress
          if (progressData && progressData.current_step !== undefined) {
            dispatch(setCurrentStep(progressData.current_step));
          }
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [dispatch, user]);
  
  const handleStepChange = async (index) => {
    dispatch(setCurrentStep(index));
    
    // Update user progress in the database
    if (progressRecord && user) {
      try {
        await updateUserProgress(progressRecord.Id, {
          current_step: index
        });
      } catch (error) {
        console.error("Failed to update user progress:", error);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.firstName || 'Student'}</h1>
        <p className="text-surface-600 dark:text-surface-300">
          Continue your JavaScript learning journey
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with steps */}
        <div className="lg:col-span-1">
          <div className="card p-4 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-primary" />
              <h2 className="text-xl font-semibold">Tutorial Progress</h2>
            </div>
            
            <div className="mb-4 p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-secondary" />
                  <span className="text-sm">Completed</span>
                </div>
                <span className="text-sm font-semibold">{completedSteps?.length || 0}/{steps?.length || 0}</span>
              </div>
              <div className="w-full bg-surface-200 dark:bg-surface-700 h-2 rounded-full mt-2">
                <div 
                  className="bg-secondary h-2 rounded-full" 
                  style={{width: `${steps.length ? (completedSteps.length / steps.length) * 100 : 0}%`}}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => handleStepChange(index)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    index === currentStepIndex 
                      ? 'bg-primary/10 dark:bg-primary/20 border-l-4 border-primary' 
                      : 'hover:bg-surface-100 dark:hover:bg-surface-800 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      index === currentStepIndex ? 'bg-primary text-white' : 
                      completedSteps.includes(step.id) ? 'bg-secondary text-white' : 
                      'bg-surface-200 dark:bg-surface-700'
                    }`}>
                      {completedSteps.includes(step.id) ? <CheckCircle size={12} /> : index + 1}
                    </div>
                    <span className={index === currentStepIndex ? 'font-medium' : ''}>{step.title}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {progressRecord?.last_accessed && (
              <div className="mt-4 text-xs text-surface-500 flex items-center gap-1">
                <Clock size={12} />
                <span>Last accessed: {format(new Date(progressRecord.last_accessed), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          {steps.length > 0 && currentStepIndex < steps.length && (
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-2">{steps[currentStepIndex].title}</h2>
              <p className="text-surface-600 dark:text-surface-300 mb-6">
                {steps[currentStepIndex].description}
              </p>
              
              {steps[currentStepIndex].content && (
                <div className="bg-surface-50 dark:bg-surface-800/50 p-4 rounded-lg border border-surface-200 dark:border-surface-700 mb-6">
                  <p className="text-surface-700 dark:text-surface-300">
                    {steps[currentStepIndex].content}
                  </p>
                </div>
              )}
              
              <MainFeature currentStep={currentStepIndex} steps={steps} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;