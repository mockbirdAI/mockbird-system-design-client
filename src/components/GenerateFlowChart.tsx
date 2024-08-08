import React, { useState } from 'react';

const GenerateFlowchart: React.FC<{ addNodesAndEdges: (nodes: any[], edges: any[]) => void }> = ({ addNodesAndEdges }) => {
  const [useCase, setUseCase] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-flow-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ useCase }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flowchart.');
      }
      const res = await response.json();
      console.log(res);
      const { nodes, edges } = res

      addNodesAndEdges(nodes, edges);
      setUseCase('');
    } catch (error) {
      console.error('Error generating flowchart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chatbot ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-header" onClick={() => setIsOpen(!isOpen)}>
        <span>Mockbird AI</span>
        <button className="toggle-button">{isOpen ? 'Close' : 'Open'}</button>
      </div>
      {isOpen && (
        <div className="chatbot-body">
          <textarea
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            placeholder="Describe your use case..."
            rows={5}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Diagram'}
          </button>
        </div>
      )}
      <style jsx>{`
        .chatbot {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 300px;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .chatbot-header {
          padding: 10px;
          background-color: #007bff;
          color: white;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .chatbot-body {
          padding: 10px;
        }
        .toggle-button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default GenerateFlowchart;
