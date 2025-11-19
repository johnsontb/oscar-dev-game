import React from 'react';
import { Bot } from 'lucide-react';

interface MascotProps {
  message?: string;
  emotion?: 'happy' | 'thinking' | 'waiting';
}

export const Mascot: React.FC<MascotProps> = ({ message, emotion = 'happy' }) => {
  return (
    <div className="fixed bottom-4 right-4 flex items-end gap-4 z-50">
      {message && (
        <div className="bg-white text-slate-900 p-4 rounded-2xl rounded-br-none shadow-xl max-w-xs border-4 border-orange-400 animate-bounce-slight">
          <p className="font-bold text-lg">{message}</p>
        </div>
      )}
      <div className={`
        w-24 h-24 bg-orange-400 rounded-full flex items-center justify-center shadow-lg border-4 border-white
        transition-transform duration-300 hover:scale-110
        ${emotion === 'thinking' ? 'animate-pulse' : ''}
      `}>
        <Bot size={48} color="white" />
      </div>
    </div>
  );
};