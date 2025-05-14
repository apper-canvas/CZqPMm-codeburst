import { useEffect, useState } from 'react';
import { Code, Terminal, Play } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';

function MainFeature({ currentStep, steps }) {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  
  useEffect(() => {
    if (steps && steps[currentStep]) {
      const stepData = steps[currentStep];
      setCode(stepData.code_example || '// Write your code here');
      setOutput('');
    }
  }, [currentStep, steps]);
  
  useEffect(() => {
    // Highlight code when it changes
    Prism.highlightAll();
  }, [code]);
  
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };
  
  const runCode = () => {
    setIsRunning(true);
    setOutput('');
    
    try {
      // Create a safe environment to run the code
      const originalLog = console.log;
      let outputBuffer = '';
      
      console.log = (...args) => {
        outputBuffer += args.join(' ') + '\n';
      };
      
      // Run the code
      eval(code);
      
      // Restore console.log
      console.log = originalLog;
      
      setOutput(outputBuffer || 'Code executed successfully with no output.');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Code size={18} className="text-primary" />
            <h3 className="font-semibold">Code Editor</h3>
          </div>
          <div className="relative">
            <pre className="code-editor overflow-auto max-h-[300px]">
              <code className="language-javascript">{code}</code>
            </pre>
            <textarea 
              value={code}
              onChange={handleCodeChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 resize-none"
              spellCheck="false"
            />
          </div>
          <button 
            onClick={runCode}
            disabled={isRunning}
            className="mt-2 btn btn-primary flex items-center gap-2"
          >
            <Play size={16} />
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={18} className="text-secondary" />
            <h3 className="font-semibold">Output</h3>
          </div>
          <div className="code-output overflow-auto max-h-[300px] whitespace-pre-wrap">
            {output || 'Output will appear here when you run your code.'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainFeature;