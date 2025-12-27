
import React from 'react';

interface ControlPanelProps {
  currentIndex: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
  onReset: () => void;
  progress: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  currentIndex,
  totalSteps,
  onPrev,
  onNext,
  onPlay,
  onPause,
  isPlaying,
  onReset,
  progress
}) => {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-1.5">
          <button 
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            title="Previous Step"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          {isPlaying ? (
            <button 
              onClick={onPause}
              className="p-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white shadow-lg shadow-blue-900/20 transition-all"
              title="Pause"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            </button>
          ) : (
            <button 
              onClick={onPlay}
              className="p-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white shadow-lg shadow-blue-900/20 transition-all"
              title="Play Animation"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            </button>
          )}

          <button 
            onClick={onNext}
            disabled={currentIndex === totalSteps - 1}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            title="Next Step"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          <button 
            onClick={onReset}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-red-400 transition-all ml-2"
            title="Reset"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>

        <div className="flex-1 max-w-md w-full ml-0 sm:ml-4">
           <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-400 font-medium tracking-tight">Step {currentIndex + 1} / {totalSteps}</span>
              <span className="text-[10px] text-blue-400 font-bold">{Math.round(progress)}%</span>
           </div>
           <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
