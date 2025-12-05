import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import MessageItem from './components/MessageItem';
import InputArea from './components/InputArea';
import { Message, Attachment } from './types';
import { sendMessageStream, startChat } from './services/geminiService';
import { generateId } from './utils/helpers';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat on mount
  useEffect(() => {
    startChat();
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string, attachments: Attachment[]) => {
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      text: text,
      attachments: attachments,
      timestamp: Date.now()
    };

    // Optimistically add user message
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const botMessageId = generateId();
    const initialBotMessage: Message = {
      id: botMessageId,
      role: 'model',
      text: '', // Start empty
      timestamp: Date.now(),
      isStreaming: true
    };

    setMessages(prev => [...prev, initialBotMessage]);

    try {
      const stream = sendMessageStream(text, attachments);
      let accumulatedText = '';

      for await (const chunk of stream) {
        accumulatedText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId 
            ? { ...msg, text: accumulatedText }
            : msg
        ));
      }
      
      // Finished streaming
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId 
          ? { ...msg, isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error("Failed to generate response", error);
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId 
          ? { 
              ...msg, 
              isStreaming: false, 
              isError: true, 
              text: "Sorry, I encountered an error while processing your request. Please try again." 
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    startChat();
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30">
      <Header onNewChat={handleNewChat} />

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-4">
          
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center opacity-0 animate-in fade-in duration-700 slide-in-from-bottom-4">
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20">
                <Sparkles size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">How can I help you today?</h2>
              <p className="text-gray-400 max-w-md">
                I can explain concepts, analyze images, write code, or just chat. 
                Upload a photo to get started with visual tasks.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((msg) => (
              <MessageItem key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>
      </main>

      {/* Input Section */}
      <footer className="w-full bg-gray-950/90 backdrop-blur-sm pt-2">
        <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default App;
