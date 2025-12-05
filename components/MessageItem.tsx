import React from 'react';
import { Message } from '../types';
import { Bot, User, AlertCircle } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] lg:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600' : 'bg-emerald-600'}`}>
          {isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
        </div>

        {/* Content Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`relative px-5 py-3.5 rounded-2xl shadow-sm ${
            isUser 
              ? 'bg-blue-600 text-white rounded-tr-sm' 
              : message.isError 
                ? 'bg-red-900/50 border border-red-700 text-red-200 rounded-tl-sm'
                : 'bg-gray-800 text-gray-100 border border-gray-700/50 rounded-tl-sm'
          }`}>
            
            {/* Attachments (User only usually) */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {message.attachments.map((att, idx) => (
                  <div key={idx} className="relative group overflow-hidden rounded-lg border border-white/20">
                    <img 
                      src={att.previewUrl} 
                      alt="attachment" 
                      className="h-32 w-auto object-cover opacity-90 transition-opacity group-hover:opacity-100" 
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Text Content */}
            <div className={`${isUser ? 'text-white' : 'text-gray-100'}`}>
              {message.isError ? (
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{message.text}</span>
                </div>
              ) : (
                <MarkdownRenderer content={message.text} />
              )}
            </div>
            
            {/* Loading Indicator */}
            {message.isStreaming && !message.isError && (
               <span className="inline-block w-2 h-4 ml-1 align-middle bg-current animate-pulse"/>
            )}
          </div>
          
          <span className="text-xs text-gray-500 mt-1 px-1">
            {isUser ? 'You' : 'OpenAsk'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
