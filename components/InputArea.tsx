import React, { useRef, useState, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Attachment } from '../types';
import { fileToBase64 } from '../utils/helpers';

interface InputAreaProps {
  onSendMessage: (text: string, attachments: Attachment[]) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments: Attachment[] = [];
      // Cast Array.from result to File[] to avoid 'unknown' type inference
      const files = Array.from(e.target.files) as File[];
      for (const file of files) {
        try {
          const base64 = await fileToBase64(file);
          newAttachments.push({
            file,
            previewUrl: URL.createObjectURL(file),
            mimeType: file.type,
            base64Data: base64
          });
        } catch (err) {
          console.error("Error processing file", err);
        }
      }
      setAttachments(prev => [...prev, ...newAttachments]);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if ((!text.trim() && attachments.length === 0) || isLoading) return;
    onSendMessage(text, attachments);
    setText('');
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      <div className="relative bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50">
        
        {/* Preview Area */}
        {attachments.length > 0 && (
          <div className="flex gap-3 p-3 pb-0 overflow-x-auto custom-scrollbar">
            {attachments.map((att, idx) => (
              <div key={idx} className="relative group shrink-0">
                <img 
                  src={att.previewUrl} 
                  alt="preview" 
                  className="h-20 w-20 object-cover rounded-lg border border-gray-600 bg-gray-900" 
                />
                <button
                  onClick={() => removeAttachment(idx)}
                  className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1 shadow-md hover:bg-red-500 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Controls */}
        <div className="flex items-end gap-2 p-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Upload image"
            disabled={isLoading}
          >
            <ImageIcon size={22} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*"
            multiple
          />

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={attachments.length > 0 ? "Ask about the image..." : "Ask anything..."}
            className="flex-1 max-h-48 bg-transparent text-white placeholder-gray-400 border-none focus:ring-0 resize-none py-2 px-1 leading-relaxed custom-scrollbar"
            rows={1}
            disabled={isLoading}
          />

          <button
            onClick={handleSend}
            disabled={isLoading || (!text.trim() && attachments.length === 0)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isLoading || (!text.trim() && attachments.length === 0)
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'
            }`}
          >
            {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
          </button>
        </div>
      </div>
      <div className="text-center mt-2">
         <p className="text-xs text-gray-500">
           OpenAsk can make mistakes. Consider checking important information.
         </p>
      </div>
    </div>
  );
};

export default InputArea;