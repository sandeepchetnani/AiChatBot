import { useState } from 'react';
import { sendMessage, AVAILABLE_MODELS } from './services/openRouterApi';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState(AVAILABLE_MODELS[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await sendMessage(newMessages, model);
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <h1>AI Chat</h1>
        
        <div className="model-selector">
          <label htmlFor="model">Model: </label>
          <select 
            id="model" 
            value={model} 
            onChange={(e) => setModel(e.target.value)}
          >
            {AVAILABLE_MODELS.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
              <p>{msg.content}</p>
            </div>
          ))}
          {loading && <div className="message assistant loading">AI is thinking...</div>}
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
