import React from 'react';
import { Sparkles, Trash2 } from 'lucide-react';

interface HeaderProps {
  onNewChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewChat }) => {
  return (
    <header className="sticky top-0 z-10 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-blue-500 to-emerald-500 p-1.5 rounded-lg">
             <Sparkles size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            OpenAsk
          </h1>
        </div>
        
        <button 
          onClick={onNewChat}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors"
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
