import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RefreshCw, Copy, CheckCircle, XCircle } from 'lucide-react'

// Tutorial content for each step
const tutorialContent = {
  0: {
    initialCode: '// Welcome to JavaScript!\n// This is a comment - it doesn\'t affect your code\n\n// Click "Run Code" to see what happens',
    expectedOutput: '',
    hints: [
      "JavaScript comments start with // for single line comments",
      "Multi-line comments are wrapped in /* and */",
      "Comments are useful for explaining your code"
    ]
  },
  1: {
    initialCode: '// Let\'s write our first line of JavaScript code\n\n// Type your "Hello World" code below:\n\n\n// Hint: Use console.log("Hello, World!");',
    expectedCode: 'console.log("Hello, World!");',
    expectedOutput: 'Hello, World!',
    hints: [
      "Use console.log() to output text to the console",
      "Text strings need to be wrapped in quotes",
      "Don't forget the semicolon at the end of the statement"
    ]
  },
  2: {
    initialCode: '// Let\'s learn about variables\n\n// Declare a variable named "message"\n// Assign it the value "Hello, JavaScript!"\n// Then output it to the console\n\n\n// Hint: let message = "Hello, JavaScript!";',
    expectedCode: [
      'let message = "Hello, JavaScript!";',
      'console.log(message);'
    ],
    expectedOutput: 'Hello, JavaScript!',
    hints: [
      "Use let to declare variables in modern JavaScript",
      "Variable names are case-sensitive",
      "After declaring a variable, use console.log() to display its value"
    ]
  },
  3: {
    initialCode: '// Let\'s create a function\n\n// Create a function named "greet" that accepts a name parameter\n// It should return "Hello, " followed by the name\n// Call the function with your name and log the result\n\n\n// Hint: function greet(name) { return "Hello, " + name; }',
    expectedCode: [
      'function greet(name) {',
      '  return "Hello, " + name;',
      '}',
      'console.log(greet("Your Name"));'
    ],
    expectedOutput: 'Hello, Your Name',
    hints: [
      "Functions are declared using the function keyword",
      "Parameters are variables that receive values when the function is called",
      "Use the return keyword to send a value back from the function",
      "Call the function by writing its name followed by parentheses"
    ]
  }
}

function MainFeature({ currentStep }) {
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  
  // Reset state when step changes
  useEffect(() => {
    setCode(tutorialContent[currentStep]?.initialCode || '')
    setOutput('')
    setIsCorrect(null)
    setShowHints(false)
  }, [currentStep])
  
  const runCode = () => {
    setIsRunning(true)
    setOutput('')
    
    // Capture console.log output
    const originalConsoleLog = console.log
    let outputBuffer = []
    
    console.log = (...args) => {
      outputBuffer.push(args.join(' '))
      originalConsoleLog(...args)
    }
    
    try {
      // Execute the code
      // eslint-disable-next-line no-new-func
      new Function(code)()
      
      // Set the captured output
      setOutput(outputBuffer.join('\n'))
      
      // Check if the output matches the expected output
      const expectedOutput = tutorialContent[currentStep]?.expectedOutput
      if (expectedOutput) {
        setIsCorrect(outputBuffer.join('\n') === expectedOutput)
      }
      
    } catch (error) {
      setOutput(`Error: ${error.message}`)
      setIsCorrect(false)
    } finally {
      // Restore original console.log
      console.log = originalConsoleLog
      setIsRunning(false)
    }
  }
  
  const resetCode = () => {
    setCode(tutorialContent[currentStep]?.initialCode || '')
    setOutput('')
    setIsCorrect(null)
  }
  
  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }
  
  const toggleHints = () => {
    setShowHints(prev => !prev)
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800">
        <h3 className="font-medium">Interactive Code Editor</h3>
        <div className="flex gap-2">
          <button 
            onClick={resetCode}
            className="p-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 rounded-md hover:bg-surface-200 dark:hover:bg-surface-700"
            title="Reset Code"
          >
            <RefreshCw size={16} />
          </button>
          <button 
            onClick={copyCode}
            className="p-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 rounded-md hover:bg-surface-200 dark:hover:bg-surface-700"
            title="Copy Code"
          >
            {isCopied ? <CheckCircle size={16} className="text-secondary" /> : <Copy size={16} />}
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-surface-900 text-surface-100 relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-transparent font-mono text-sm resize-none outline-none min-h-[200px]"
          spellCheck="false"
          placeholder="Type your JavaScript code here..."
        />
        
        <div className="absolute top-0 left-0 w-8 h-full bg-surface-800 border-r border-surface-700 flex flex-col items-center pt-4 text-surface-500 font-mono text-xs">
          {code.split('\n').map((_, i) => (
            <div key={i} className="w-full text-center">{i + 1}</div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 p-4 border-t border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800">
        <button 
          onClick={runCode}
          disabled={isRunning}
          className="btn btn-primary flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw size={16} />
              </motion.div>
              Running...
            </>
          ) : (
            <>
              <Play size={16} />
              Run Code
            </>
          )}
        </button>
        
        <button 
          onClick={toggleHints}
          className={`btn ${showHints ? 'btn-secondary' : 'btn-outline'}`}
        >
          {showHints ? 'Hide Hints' : 'Show Hints'}
        </button>
      </div>
      
      <AnimatePresence>
        {showHints && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-primary/5 dark:bg-primary/10 border-b border-surface-200 dark:border-surface-700">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Hints
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-surface-600 dark:text-surface-300">
                {tutorialContent[currentStep]?.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="p-4">
        <h4 className="font-medium mb-2">Output:</h4>
        <div className="bg-surface-100 dark:bg-surface-800 p-3 rounded-lg font-mono text-sm min-h-[80px] whitespace-pre-wrap">
          {output || 'Run your code to see the output here...'}
        </div>
        
        {isCorrect !== null && (
          <div className={`mt-4 p-3 rounded-lg ${
            isCorrect 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <CheckCircle size={18} className="text-green-500 dark:text-green-400" />
              ) : (
                <XCircle size={18} className="text-red-500 dark:text-red-400" />
              )}
              <span className="font-medium">
                {isCorrect 
                  ? 'Great job! Your code produced the expected output.' 
                  : 'Not quite right. Try again or check the hints for help.'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MainFeature