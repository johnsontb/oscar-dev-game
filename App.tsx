
import React, { useState, useEffect } from 'react';
import { Rocket, Play, Star, Lock, RefreshCw, CheckCircle, ArrowRight, Map, BookOpen, Lightbulb, Volume2, VolumeX } from 'lucide-react';
import { LEVELS } from './constants';
import { Level, GameState, UserState } from './types';
import { validateCode, getHint } from './services/geminiService';
import { soundService } from './services/soundService';
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
  const [isMuted, setIsMuted] = useState(false);

  const currentLevel = LEVELS.find(l => l.id === userState.currentLevelId) || LEVELS[0];

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      // When entering playing state, ensure we have a fresh prompt.
      setValidationMessage("Look at the blue box. Type that code!");
    }
  }, [gameState]);

  // Initialize audio context on first interaction
  const handleInteraction = () => {
    soundService.init();
    soundService.startMusic();
    soundService.playClick();
  };
  
  const toggleMute = () => {
      const newMuteState = !isMuted;
      setIsMuted(newMuteState);
      soundService.setMute(newMuteState);
  }

  const handleLevelSelect = (levelId: number) => {
    handleInteraction();
    if (userState.unlockedLevels.includes(levelId)) {
      soundService.playWarp();
      setUserState(prev => ({ ...prev, currentLevelId: levelId }));
      
      const level = LEVELS.find(l => l.id === levelId);
      setCode(level?.initialCode || "");
      setGameState(GameState.STORY);
      
      // Robot voice reads the story
      if (level) {
        setTimeout(() => soundService.speak(level.story), 600);
      }
    }
  };

  const handleCheckCode = async () => {
    soundService.init(); // Ensure audio is ready
    soundService.startMusic(); // Ensure music is running
    soundService.playClick();
    
    setIsValidating(true);
    setMascotEmotion('thinking');
    setValidationMessage("Checking your code...");
    
    const result = await validateCode(currentLevel, code);
    
    setIsValidating(false);
    setValidationMessage(result.feedback);
    
    if (result.success) {
      soundService.playSuccess();
      soundService.speak("Awesome! " + result.feedback);
      
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
      soundService.playFailure();
      soundService.speak(result.feedback);
      setMascotEmotion('waiting');
    }
  };

  const handleGetHint = async () => {
      soundService.init();
      soundService.startMusic();
      soundService.playClick();
      setMascotEmotion('thinking');
      setValidationMessage("Thinking...");
      const hint = await getHint(currentLevel, code);
      setValidationMessage(hint);
      soundService.speak(hint);
      setMascotEmotion('happy');
  };

  const handleNextLevel = () => {
    soundService.init();
    soundService.playWarp();
    const nextId = currentLevel.id + 1;
    if (nextId <= LEVELS.length) {
      setUserState(prev => ({ ...prev, currentLevelId: nextId }));
      
      const nextLevel = LEVELS.find(l => l.id === nextId);
      setCode(nextLevel?.initialCode || "");
      setGameState(GameState.STORY);
      
      if (nextLevel) {
          setTimeout(() => soundService.speak(nextLevel.story), 600);
      }
    } else {
      setGameState(GameState.MENU); // Finished all levels
    }
  };

  const insertCode = (snippet: string) => {
    soundService.init();
    soundService.startMusic();
    soundService.playSnap();
    setCode(prev => prev + snippet);
  };

  const handleNavClick = (targetState: GameState) => {
      handleInteraction();
      setGameState(targetState);
  }

  // --- RENDERERS ---

  if (gameState === GameState.MENU) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
        {/* Mute Button Absolute in Menu */}
        <button 
            onClick={toggleMute}
            className="absolute top-6 right-6 p-3 bg-slate-800/50 hover:bg-slate-700 text-white rounded-full transition-colors"
        >
            {isMuted ? <VolumeX size={24}/> : <Volume2 size={24}/>}
        </button>

        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 mb-12 drop-shadow-lg text-center">
          OSCAR'S GALAXY
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
                  <span className="text-3xl font-bold">Level {level.id}</span>
                  <span className="text-lg text-indigo-200 font-medium">{level.title}</span>
                </div>
              </button>
            );
          })}
        </div>
        <Mascot message="Pick a mission, Captain Oscar!" />
      </div>
    );
  }

  if (gameState === GameState.STORY) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm z-50 fixed inset-0">
        <div className="bg-white text-slate-900 max-w-2xl w-full rounded-3xl p-8 border-8 border-orange-400 shadow-2xl animate-fade-in-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-black text-indigo-600">Mission {currentLevel.id}</h2>
            <button onClick={toggleMute} className="text-slate-400 hover:text-slate-800">
                {isMuted ? <VolumeX size={24}/> : <Volume2 size={24}/>}
            </button>
          </div>
          <p className="text-3xl font-medium leading-relaxed mb-8 text-slate-800">
            {currentLevel.story}
          </p>
          <div className="flex justify-between items-center">
            <button 
                onClick={() => soundService.speak(currentLevel.story)}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-lg transition-colors"
            >
                <Volume2 size={24} />
                Read to me
            </button>

            <button
              onClick={() => handleNavClick(GameState.PLAYING)}
              className="bg-green-500 hover:bg-green-400 text-white text-3xl font-bold px-10 py-6 rounded-2xl border-b-8 border-green-700 transition-transform active:scale-95 flex items-center gap-3"
            >
              Let's Code! <ArrowRight size={40} />
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
          <h2 className="text-5xl font-black text-green-600 mb-4">YOU DID IT!</h2>
          <p className="text-2xl text-slate-700 mb-8">{validationMessage}</p>
          <div className="flex gap-4 w-full">
             <button
              onClick={() => handleNavClick(GameState.PLAYING)}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xl font-bold px-6 py-4 rounded-2xl border-b-4 border-slate-400"
            >
              Wait
            </button>
            <button
              onClick={handleNextLevel}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-2xl font-bold px-6 py-4 rounded-2xl border-b-4 border-indigo-800 shadow-xl"
            >
              Next!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => handleNavClick(GameState.MENU)} className="text-slate-400 hover:text-white transition-colors">
            <Map size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white tracking-wide">Level {currentLevel.id}: <span className="text-indigo-400">{currentLevel.title}</span></h2>
        </div>
        <div className="flex items-center gap-4">
             <button onClick={toggleMute} className="text-slate-400 hover:text-white transition-colors">
                {isMuted ? <VolumeX size={20}/> : <Volume2 size={20}/>}
            </button>
            <button onClick={() => handleNavClick(GameState.STORY)} className="flex items-center gap-2 text-indigo-300 font-bold bg-indigo-900/50 px-3 py-1 rounded-lg hover:bg-indigo-900 transition-colors">
                 <BookOpen size={18} /> Mission
            </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex gap-4 p-4 h-full overflow-hidden">
        {/* Left Column: Guide + Editor + Controls */}
        <div className="w-1/2 flex flex-col gap-4 h-full">
            {/* Persistent Mission Guide */}
            <div className="bg-indigo-600 text-white p-4 rounded-xl shadow-lg border-b-4 border-indigo-800 shrink-0">
                <h3 className="text-indigo-200 text-sm font-bold uppercase mb-1 flex items-center gap-2"><Lightbulb size={14}/> Type This:</h3>
                {currentLevel.guideSnippet && (
                    <div className="bg-black/30 p-3 rounded-lg font-mono text-2xl text-yellow-300 tracking-wide border border-indigo-400/30 break-all shadow-inner">
                        {currentLevel.guideSnippet}
                    </div>
                )}
            </div>

          {/* Editor */}
          <div className="flex-1 relative min-h-0">
             <CodeEditor code={code} onChange={setCode} />
          </div>

          {/* Control Panel */}
          <div className="bg-slate-800 p-3 rounded-xl border-2 border-slate-700 flex flex-col gap-3 shrink-0 shadow-xl">
            <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Toolbox</span>
            </div>
            {/* Toolbox buttons row */}
            <Toolbox onInsert={insertCode} />
            
            {/* Action buttons row - Separate from Toolbox to prevent overlap */}
            <div className="flex gap-3 pt-3 border-t border-slate-700 mt-1">
                 <button
                  onClick={handleGetHint}
                  className="bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-bold px-5 py-3 rounded-xl shadow-lg border-b-4 border-yellow-700 flex items-center gap-2 active:mt-1 active:border-b-0 active:translate-y-1 transition-all"
                >
                  <RefreshCw size={20} /> Hint
                </button>
                <button
                  onClick={handleCheckCode}
                  disabled={isValidating}
                  className="flex-1 bg-green-500 hover:bg-green-400 text-white text-2xl font-bold px-6 py-3 rounded-xl shadow-lg border-b-4 border-green-700 flex items-center justify-center gap-3 active:mt-1 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-70 disabled:transform-none"
                >
                  {isValidating ? 'Checking...' : <>GO! <Play fill="currentColor" /></>}
                </button>
            </div>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="w-1/2 h-full">
          <PreviewWindow code={code} baseStyles={currentLevel.previewBaseStyles} />
        </div>
      </div>
      
      <Mascot message={validationMessage} emotion={mascotEmotion} />
    </div>
  );
};

export default App;
