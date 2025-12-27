
import React, { useState, useEffect, useMemo } from 'react';
import { AnimationStep, InputItem } from './types';
import { DEFAULT_INPUT } from './constants';
import { generateAnimationSteps } from './services/huffmanService';
import TreeVisualizer from './components/TreeVisualizer';
import CodePanel from './components/CodePanel';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';

const App: React.FC = () => {
  const [inputData] = useState<InputItem[]>(DEFAULT_INPUT);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed] = useState(1200);

  const steps = useMemo(() => generateAnimationSteps(inputData), [inputData]);
  const currentStep = steps[currentIndex] || steps[0];

  useEffect(() => {
    let timer: number;
    if (isPlaying && currentIndex < steps.length - 1) {
      timer = window.setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, playSpeed);
    } else if (currentIndex === steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, steps.length, playSpeed]);

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const jumpToSection = (section: 'SELECT' | 'CREATE' | 'CODING') => {
    const targetIdx = steps.findIndex(s => {
      if (section === 'SELECT') return s.phase === 'SELECTION';
      if (section === 'CREATE') return s.phase === 'MERGING';
      if (section === 'CODING') return s.phase === 'CODING';
      return false;
    });
    if (targetIdx !== -1) {
      setCurrentIndex(targetIdx);
      setIsPlaying(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0f172a] overflow-hidden p-4 gap-4">
      {/* Header - Fixed Height */}
      <header className="flex-shrink-0 flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800/60 backdrop-blur-md">
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
            <span className="bg-blue-600 px-2 py-0.5 rounded text-sm mr-2 shadow-lg shadow-blue-900/40">HT</span>
            Huffman Tree Visualizer
          </h1>
          <p className="text-slate-500 text-xs hidden sm:block">哈夫曼树构造与编码算法可视化</p>
        </div>
        <div className="flex items-center space-x-2">
           <span className="text-[10px] font-bold text-slate-500 px-2 uppercase border-r border-slate-800 mr-1">Input:</span>
           <div className="flex gap-1 overflow-x-auto max-w-[200px] no-scrollbar">
             {inputData.map((item, i) => (
               <span key={i} className="px-1.5 py-0.5 bg-slate-800/80 text-blue-400 rounded text-[10px] font-mono border border-slate-700/50 whitespace-nowrap">
                 {item.ch}:{item.weight}
               </span>
             ))}
           </div>
        </div>
      </header>

      {/* Main Layout - Expands to fill available space */}
      <div className="flex-grow flex flex-col md:flex-row gap-4 min-h-0">
        {/* Left Column: Code Panel - Increased width from 1/4 to 1/3 (lg) and 1/3 to 2/5 (md) */}
        <aside className="w-full md:w-[40%] lg:w-[35%] flex-shrink-0 flex flex-col min-h-0 transition-all duration-300">
          <CodePanel 
            currentRange={currentStep.codeLineRange} 
            onSectionClick={jumpToSection}
          />
        </aside>

        {/* Right Column: Visualization + Explanation */}
        <main className="flex-grow flex flex-col gap-4 min-h-0 min-w-0">
          {/* Controls - Top of Main */}
          <section className="flex-shrink-0">
            <ControlPanel 
              currentIndex={currentIndex}
              totalSteps={steps.length}
              onPrev={handlePrev}
              onNext={handleNext}
              onPlay={handlePlay}
              onPause={handlePause}
              isPlaying={isPlaying}
              onReset={handleReset}
              progress={(currentIndex / (steps.length - 1)) * 100}
            />
          </section>

          {/* Visualization Area - Fills remaining space */}
          <section className="flex-grow flex flex-col xl:flex-row gap-4 min-h-0">
            {/* Tree Canvas */}
            <div className="flex-grow flex-shrink min-h-0 bg-slate-900/40 rounded-xl border border-slate-800/60 overflow-hidden min-w-0">
              <TreeVisualizer step={currentStep} />
            </div>
            
            {/* Right Side Info Panel */}
            <div className="xl:w-72 flex-shrink-0 min-h-[180px] xl:h-full overflow-hidden">
              <InfoPanel step={currentStep} />
            </div>
          </section>
        </main>
      </div>

      {/* Mini Footer - Fixed Height */}
      <footer className="flex-shrink-0 flex items-center justify-center text-[10px] text-slate-600 gap-4 border-t border-slate-900 pt-2">
        <span>C++ Huffman Algorithm Visualizer</span>
        <span className="w-1 h-1 rounded-full bg-slate-800"></span>
        <span>Interactive Education Tool</span>
      </footer>
    </div>
  );
};

export default App;
