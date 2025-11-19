import React, { useState, useEffect } from 'react';
import { Rocket, Play, Star, Lock, RefreshCw, CheckCircle, ArrowRight, Map } from 'lucide-react';
import { LEVELS } from './constants';
import { Level, GameState, UserState } from './types';
import { validateCode, getHint } from './services/geminiService';
import { CodeEditor } from './components/CodeEditor';
import { PreviewWindow } from './components/PreviewWindow';
import { Mascot } from './components/Mascot';
import { Toolbox } from './components/Toolbox';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [userState, setUserState] = useState<UserState>({
    unlockedLevels: [1],
    completedLevels: [],
    currentLevelId: 1
  });
  const [code, setCode] = useState("");
  const [validationMessage, setValidationMessage] = useState("Hi Oscar! I'm Bit. Let's code!");
  const [isValidating, setIsValidating] = useState(false);
  const [mascotEmotion, setMascotEmotion] = useState<'happy' | 'thinking' | 'waiting'>('happy');

  const currentLevel = LEVELS.find(l => l.id === userState.currentLevelId) || LEVELS[0];

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      // Keep existing code if re-entering, or reset to initial if new
      if (code === "" || code === LEVELS.find(l => l.id === userState.currentLevelId - 1)?.initialCode) {
           setCode(currentLevel.initialCode);
      }
      setValidationMessage("Ready for instructions, Captain!");
    }
  }, [gameState, userState.currentLevelId, currentLevel, code]);

  const handleLevelSelect = (levelId: number) => {
    if (userState.unlockedLevels.includes(levelId)) {
      setUserState(prev => ({ ...prev, currentLevelId: levelId }));
      setCode(LEVELS.find(l => l.id === levelId)?.initialCode || "");
      setGameState(GameState.STORY);
    }
  };

  const handleCheckCode = async () => {
    setIsValidating(true);
    setMascotEmotion('thinking');
    setValidationMessage("Scanning your code...");
    
    const result = await validateCode(currentLevel, code);
    
    setIsValidating(false);
    setValidationMessage(result.feedback);
    
    if (result.success) {
      setMascotEmotion('happy');
      setGameState(GameState.SUCCESS);
      if (!userState.completedLevels.includes(currentLevel.id)) {
        const nextLevelId = currentLevel.id + 1;
        const newUnlocked = [...userState.unlockedLevels];
        if (!newUnlocked.includes(nextLevelId) && nextLevelId <= LEVELS.length) {
          newUnlocked.push(nextLevelId);
        }
        setUserState(prev => ({
          ...prev,
          completedLevels: [...prev.completedLevels, currentLevel.id],
          unlockedLevels: newUnlocked
        }));
      }
    } else {
      setMascotEmotion('waiting');
    }
  };

  const handleGetHint = async () => {
      setMascotEmotion('thinking');
      setValidationMessage("Computing hint...");
      const hint = await getHint(currentLevel, code);
      setValidationMessage(hint);
      setMascotEmotion('happy');
  };

  const handleNextLevel = () => {
    const nextId = currentLevel.id + 1;
    if (nextId <= LEVELS.length) {
      setUserState(prev => ({ ...prev, currentLevelId: nextId }));
      setCode(LEVELS.find(l => l.id === nextId)?.initialCode || "");
      setGameState(GameState.STORY);
    } else {
      setGameState(GameState.MENU); // Finished all levels
    }
  };

  const insertCode = (snippet: string) => {
    setCode(prev => prev + snippet);
  };

  // --- RENDERERS ---

  if (gameState === GameState.MENU) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 mb-12 drop-shadow-lg text-center">
          OSCAR'S CODE GALAXY
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl w-full">
          {LEVELS.map((level) => {
            const isUnlocked = userState.unlockedLevels.includes(level.id);
            const isCompleted = userState.completedLevels.includes(level.id);
            
            return (
              <button
                key={level.id}
                onClick={() => handleLevelSelect(level.id)}
                disabled={!isUnlocked}
                className={`
                  relative group p-6 rounded-3xl border-b-8 transition-all duration-200 transform hover:-translate-y-2
                  ${isUnlocked 
                    ? 'bg-indigo-600 border-indigo-800 hover:bg-indigo-500 cursor-pointer' 
                    : 'bg-slate-700 border-slate-900 opacity-50 cursor-not-allowed'}
                `}
              >
                {isCompleted && (
                  <div className="absolute -top-3 -right-3 bg-green-400 text-slate-900 rounded-full p-2 shadow-lg">
                    <Star size={24} fill="currentColor" />
                  </div>
                )}
                <div className="flex flex-col items-center gap-3">
                  {isUnlocked ? (
                    <Rocket size={48} className="text-white mb-2" />
                  ) : (
                    <Lock size={48} className="text-slate-400 mb-2" />
                  )}
                  <span className="text-2xl font-bold">Level {level.id}</span>
                  <span className="text-sm text-indigo-200 font-medium">{level.title}</span>
                </div>
              </button>
            );
          })}
        </div>
        <Mascot message="Pick a mission, Oscar!" />
      </div>
    );
  }

  if (gameState === GameState.STORY) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm z-50 fixed inset-0">
        <div className="bg-white text-slate-900 max-w-2xl w-full rounded-3xl p-8 border-8 border-orange-400 shadow-2xl animate-fade-in-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-black text-indigo-600">Mission Briefing</h2>
            <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full font-bold">Level {currentLevel.id}</span>
          </div>
          <p className="text-2xl font-medium leading-relaxed mb-8 text-slate-700">
            {currentLevel.story}
          </p>
          <div className="bg-yellow-50 border-l-8 border-yellow-400 p-4 mb-8 rounded-r-lg">
            <h3 className="text-xl font-bold text-yellow-700 mb-2">Your Goal:</h3>
            <p className="text-lg">{currentLevel.mission}</p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setGameState(GameState.PLAYING)}
              className="bg-green-500 hover:bg-green-400 text-white text-2xl font-bold px-8 py-4 rounded-2xl border-b-8 border-green-700 transition-transform active:scale-95 flex items-center gap-3"
            >
              Start Building <ArrowRight size={32} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === GameState.SUCCESS) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm z-50 fixed inset-0">
        <div className="bg-white text-slate-900 max-w-lg w-full rounded-3xl p-8 border-8 border-green-500 shadow-2xl flex flex-col items-center text-center animate-bounce-slight">
          <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-6">
             <CheckCircle size={64} className="text-green-500" />
          </div>
          <h2 className="text-4xl font-black text-green-600 mb-4">Mission Accomplished!</h2>
          <p className="text-xl text-slate-600 mb-8">{validationMessage}</p>
          <div className="flex gap-4 w-full">
             <button
              onClick={() => setGameState(GameState.PLAYING)}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xl font-bold px-6 py-4 rounded-2xl border-b-4 border-slate-400"
            >
              Stay Here
            </button>
            <button
              onClick={handleNextLevel}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xl font-bold px-6 py-4 rounded-2xl border-b-4 border-indigo-800 shadow-xl"
            >
              Next Mission
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => setGameState(GameState.MENU)} className="text-slate-400 hover:text-white">
            <Map size={24} />
          </button>
          <h2 className="text-xl font-bold text-white">Level {currentLevel.id}: <span className="text-orange-400">{currentLevel.title}</span></h2>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={() => setGameState(GameState.STORY)} className="text-sm font-bold text-indigo-300 hover:text-indigo-200 underline">
                View Mission
            </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex gap-4 p-4 h-[calc(100vh-4rem)]">
        {/* Left: Editor */}
        <div className="w-1/2 flex flex-col gap-4">
          <div className="flex-1 relative">
             <CodeEditor code={code} onChange={setCode} />
          </div>
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
            <Toolbox onInsert={insertCode} />
          </div>
        </div>

        {/* Right: Preview */}
        <div className="w-1/2 relative">
          <PreviewWindow code={code} baseStyles={currentLevel.previewBaseStyles} />
        </div>
      </div>

      {/* Footer Controls */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-40">
         <button
          onClick={handleGetHint}
          className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-6 py-3 rounded-full shadow-lg border-b-4 border-yellow-600 flex items-center gap-2 transition-transform active:scale-95"
        >
          <RefreshCw size={20} /> Need a Hint?
        </button>
        <button
          onClick={handleCheckCode}
          disabled={isValidating}
          className="bg-green-500 hover:bg-green-400 text-white text-xl font-bold px-10 py-3 rounded-full shadow-lg border-b-4 border-green-700 flex items-center gap-3 transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-wait"
        >
          {isValidating ? 'Checking...' : <>Launch Code <Play fill="currentColor" /></>}
        </button>
      </div>
      
      <Mascot message={validationMessage} emotion={mascotEmotion} />
    </div>
  );
};

export default App;