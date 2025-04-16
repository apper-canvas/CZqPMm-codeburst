import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, ChevronLeft, Lightbulb, Code, Terminal, BookOpen } from 'lucide-react'
import MainFeature from '../components/MainFeature'

const tutorialSteps = [
  {
    id: 'intro',
    title: 'Introduction to JavaScript',
    description: "JavaScript is a programming language that powers the dynamic behavior on websites. Let's start with the classic 'Hello World' example.",
    active: true
  },
  {
    id: 'hello-world',
    title: 'Hello World',
    description: "The traditional first program in any language. We'll use console.log() to output text to the console.",
    active: false
  },
  {
    id: 'variables',
    title: 'Variables & Data Types',
    description: "Learn how to store and manipulate data using variables. We'll explore strings, numbers, booleans, and more.",
    active: false
  },
  {
    id: 'functions',
    title: 'Functions',
    description: "Functions allow you to group code together and reuse it. We'll create our first function to say hello.",
    active: false
  }
]

function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState(tutorialSteps)
  
  const goToStep = (index) => {
    if (index >= 0 && index < steps.length) {
      const updatedSteps = steps.map((step, i) => ({
        ...step,
        active: i === index
      }))
      setSteps(updatedSteps)
      setCurrentStep(index)
    }
  }
  
  const nextStep = () => {
    goToStep(currentStep + 1)
  }
  
  const prevStep = () => {
    goToStep(currentStep - 1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <motion.div 
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
      
      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Tutorial Steps</h2>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => goToStep(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      step.active 
                        ? 'bg-primary/10 dark:bg-primary/20 border-l-4 border-primary' 
                        : 'hover:bg-surface-100 dark:hover:bg-surface-800 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        step.active ? 'bg-primary text-white' : 'bg-surface-200 dark:bg-surface-700'
                      }`}>
                        {index + 1}
                      </div>
                      <span className={step.active ? 'font-medium' : ''}>{step.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <motion.div
              key={steps[currentStep].id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card p-6 mb-6">
                <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
                <p className="text-surface-600 dark:text-surface-300 mb-4">
                  {steps[currentStep].description}
                </p>
                
                {currentStep === 0 && (
                  <div className="bg-surface-50 dark:bg-surface-800/50 p-4 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="text-primary shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-medium mb-2">Getting Started</p>
                        <p className="text-sm text-surface-600 dark:text-surface-400">
                          JavaScript is a versatile programming language that runs in web browsers. 
                          It allows you to create interactive websites and applications. In this tutorial, 
                          we'll start with the basics and gradually build your skills.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <MainFeature currentStep={currentStep} />
              
              <div className="flex justify-between mt-6">
                <button 
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`btn flex items-center gap-2 ${
                    currentStep === 0 
                      ? 'opacity-50 cursor-not-allowed bg-surface-200 dark:bg-surface-800' 
                      : 'btn-outline'
                  }`}
                >
                  <ChevronLeft size={16} />
                  Previous Step
                </button>
                
                <button 
                  onClick={nextStep}
                  disabled={currentStep === steps.length - 1}
                  className={`btn flex items-center gap-2 ${
                    currentStep === steps.length - 1 
                      ? 'opacity-50 cursor-not-allowed bg-surface-200 dark:bg-surface-800' 
                      : 'btn-primary'
                  }`}
                >
                  Next Step
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home