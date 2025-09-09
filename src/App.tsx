import { useState, useRef } from 'react';

type Message = {
  sender: 'user' | 'ai';
  text: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input;
    setMessages((msgs) => [...msgs, { sender: 'user', text: userMessage }]);
    setInput('');
    try {
      const res = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { sender: 'ai', text: data.reply }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { sender: 'ai', text: 'Error: Could not reach AI backend.' }]);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Static Sidebar */}
      <aside className="hidden sm:fixed sm:flex flex-col items-center justify-start w-64 h-full py-12 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 shadow-2xl z-20 left-0 top-0">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mb-6">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="22" cy="22" rx="20" ry="20" fill="#fff" fillOpacity="0.95"/>
            <text x="50%" y="55%" textAnchor="middle" fill="#1e40af" fontSize="28" fontWeight="bold" dy=".3em">NC</text>
          </svg>
        </div>
        <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 tracking-tight drop-shadow text-center mb-2">CONNexus</div>
        <div className="text-base text-white/80 mt-4 text-center">Noah Conn's AI Assistant</div>
      </aside>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-screen sm:ml-64">
        <main className="flex-1 flex flex-col items-center w-full px-2 pt-10">
          <div className="w-full max-w-4xl flex-1 flex flex-col gap-8 pt-2 pb-8">
            {messages.length === 0 && (
              <div className="text-white/60 text-center mt-10 text-2xl">Start the conversation with Noah Conn's AI Assistant!</div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'user' ? (
                  <div className="bg-gray-200/80 text-gray-900 px-6 py-3 rounded-2xl max-w-3xl text-2xl font-semibold leading-relaxed shadow text-right">
                    {msg.text}
                  </div>
                ) : (
                  <div className="max-w-3xl break-words text-2xl font-semibold leading-relaxed text-white/90 text-left" style={{wordBreak: 'break-word'}}>
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="fixed bottom-0 left-0 w-full flex justify-center bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-transparent py-6 px-2 z-30" style={{backdropFilter: 'blur(8px)'}}>
            <form
              onSubmit={handleSend}
              className="w-full max-w-4xl flex gap-2"
              style={{marginLeft: 'auto', marginRight: 'auto'}}
            >
              <input
                type="text"
                className="flex-1 border border-gray-700 rounded-lg px-3 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white text-lg shadow"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-700 transition text-lg"
              >
                Send
              </button>
            </form>
          </div>
        </main>
        <footer className="mt-6 text-white/60 text-xs text-center pb-2">&copy; {new Date().getFullYear()} Noah C. | Powered by CONNexus</footer>
      </div>
    </div>
  );
}

export default App;
