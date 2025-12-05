import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple parser to handle code blocks and paragraphs
  // In a real production app, use 'react-markdown'
  
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-sm md:text-base leading-relaxed break-words">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : '';
          const code = match ? match[2] : part.slice(3, -3);
          return (
            <div key={index} className="bg-gray-900 rounded-md p-4 overflow-x-auto my-2 border border-gray-700">
              {lang && <div className="text-xs text-gray-400 mb-1 uppercase font-bold tracking-wider">{lang}</div>}
              <pre className="font-mono text-gray-200 whitespace-pre-wrap">
                <code>{code}</code>
              </pre>
            </div>
          );
        }
        
        // Handle bold text (**text**)
        const paragraphs = part.split('\n\n').filter(p => p.trim());
        return paragraphs.map((p, pIndex) => (
          <p key={`${index}-${pIndex}`} className="mb-2 last:mb-0">
             {p.split(/(\*\*.*?\*\*)/g).map((segment, sIndex) => {
                if (segment.startsWith('**') && segment.endsWith('**')) {
                  return <strong key={sIndex} className="font-bold text-gray-100">{segment.slice(2, -2)}</strong>;
                }
                return segment;
             })}
          </p>
        ));
      })}
    </div>
  );
};

export default MarkdownRenderer;
