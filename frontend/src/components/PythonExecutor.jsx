import { useState } from 'react';
import { runPythonCode } from '../api/cloudApi';

const PythonExecutor = () => {
  const [code, setCode] = useState('# Write your Python code here\nprint("Hello, World!")');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');

  const handleRunCode = async () => {
    if (!code.trim()) {
      setError('Please enter some Python code to execute');
      return;
    }

    setIsRunning(true);
    setError('');
    setOutput('');

    try {
      const result = await runPythonCode(code);
      
      if (result.error) {
        setError(`❌ Execution Error: ${result.error}`);
        setOutput('');
      } else {
        setOutput(JSON.stringify(result.output, null, 2));
        setError('');
      }
    } catch (error) {
      console.error('Code execution failed:', error);
      setError(`❌ Request failed: ${error.response?.data?.error || error.message}`);
      setOutput('');
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearCode = () => {
    setCode('# Write your Python code here\n');
    setOutput('');
    setError('');
  };

  const handleLoadExample = (exampleCode) => {
    setCode(exampleCode);
    setOutput('');
    setError('');
  };

  const examples = [
    {
      name: "Basic Math",
      code: "# Basic math operations\na = 10\nb = 5\nresult = a + b\nprint(f'Sum: {result}')\nprint(f'Product: {a * b}')\nprint(f'Division: {a / b}')"
    },
    {
      name: "List Operations",
      code: "# List operations\nnumbers = [1, 2, 3, 4, 5]\nsquares = [x**2 for x in numbers]\nprint(f'Original: {numbers}')\nprint(f'Squares: {squares}')\nprint(f'Sum of squares: {sum(squares)}')"
    },
    {
      name: "Dictionary Example",
      code: "# Dictionary operations\nperson = {\n    'name': 'Alice',\n    'age': 30,\n    'city': 'New York'\n}\nprint(f\"Person: {person['name']}, {person['age']} years old\")\nprint(f\"Lives in: {person['city']}\")\n\n# Add new key\nperson['occupation'] = 'Developer'\nprint(f\"Updated person: {person}\")"
    }
  ];

  return (
    <div className="python-executor-container">
      <h2>🐍 Python Code Executor</h2>
      
      <div className="examples-section">
        <h3>Quick Examples:</h3>
        <div className="example-buttons">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => handleLoadExample(example.code)}
              className="example-btn"
              disabled={isRunning}
            >
              {example.name}
            </button>
          ))}
          <button
            onClick={handleClearCode}
            className="clear-btn"
            disabled={isRunning}
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      <div className="code-section">
        <div className="code-header">
          <h3>Code Editor:</h3>
          <button
            onClick={handleRunCode}
            disabled={isRunning || !code.trim()}
            className="run-btn"
          >
            {isRunning ? '⏳ Running...' : '▶️ Run Code'}
          </button>
        </div>
        
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your Python code here..."
          className="code-editor"
          rows={12}
          disabled={isRunning}
        />
      </div>

      {error && (
        <div className="message error">
          {error}
        </div>
      )}

      {output && (
        <div className="output-section">
          <h3>✅ Execution Output:</h3>
          <pre className="output-display">{output}</pre>
        </div>
      )}

      <div className="warning-notice">
        <p>⚠️ <strong>Security Notice:</strong> This is a demo environment. Do not run untrusted or malicious code!</p>
      </div>
    </div>
  );
};

export default PythonExecutor;