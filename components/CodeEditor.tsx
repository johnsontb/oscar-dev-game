import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (val: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl">
      <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-slate-400 text-sm font-mono">script.html</span>
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-slate-900 text-green-400 p-4 font-mono text-lg resize-none focus:outline-none code-font leading-relaxed"
        spellCheck={false}
        placeholder="Type your code here..."
      />
    </div>
  );
};