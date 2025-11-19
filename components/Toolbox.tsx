import React from 'react';
import { Copy } from 'lucide-react';

interface ToolboxProps {
  onInsert: (snippet: string) => void;
}

const SNIPPETS = [
  { label: 'New Box', code: '<div></div>' },
  { label: 'Style', code: 'style=""' },
  { label: 'Color Red', code: 'background-color: red;' },
  { label: 'Color Blue', code: 'background-color: blue;' },
  { label: 'Flex', code: 'display: flex;' },
  { label: 'Center', code: 'justify-content: center;' },
  { label: 'Text', code: '<p>Hello!</p>' },
];

export const Toolbox: React.FC<ToolboxProps> = ({ onInsert }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {SNIPPETS.map((snip, idx) => (
        <button
          key={idx}
          onClick={() => onInsert(snip.code)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap"
        >
          <Copy size={14} />
          {snip.label}
        </button>
      ))}
    </div>
  );
};