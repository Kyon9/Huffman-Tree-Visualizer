
import React, { useEffect, useRef } from 'react';
import { CPP_CODE, CODE_SECTION_RANGES } from '../constants';

interface CodePanelProps {
  currentRange: [number, number];
  onSectionClick: (section: 'SELECT' | 'CREATE' | 'CODING') => void;
}

const CodePanel: React.FC<CodePanelProps> = ({ currentRange, onSectionClick }) => {
  const lines = CPP_CODE.split('\n');
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentRange]);

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Title Bar */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
        <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">C++ Algorithm</h3>
        <div className="flex space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/30"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/30"></span>
        </div>
      </div>

      {/* Code Container */}
      <div 
        ref={containerRef}
        className="flex-grow overflow-y-auto overflow-x-auto p-0 custom-scrollbar relative"
      >
        <div className="py-4 min-w-max">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isActive = lineNum >= currentRange[0] && lineNum <= currentRange[1];
            // Use the first active line as the scroll target
            const isScrollTarget = lineNum === currentRange[0];
            
            let section: 'SELECT' | 'CREATE' | 'CODING' | null = null;
            if (lineNum >= CODE_SECTION_RANGES.SELECT[0] && lineNum <= CODE_SECTION_RANGES.SELECT[1]) section = 'SELECT';
            if (lineNum >= CODE_SECTION_RANGES.CREATE[0] && lineNum <= CODE_SECTION_RANGES.CREATE[1]) section = 'CREATE';
            if (lineNum >= CODE_SECTION_RANGES.CODING[0] && lineNum <= CODE_SECTION_RANGES.CODING[1]) section = 'CODING';

            return (
              <div 
                key={idx} 
                ref={isScrollTarget ? activeLineRef : null}
                className={`flex transition-colors duration-150 relative group ${isActive ? 'bg-blue-600/20' : 'hover:bg-slate-900/40'} ${section ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => section && onSectionClick(section)}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] z-10"></div>
                )}
                
                {/* Line Number */}
                <span className={`w-10 text-[10px] font-mono ${isActive ? 'text-blue-400 font-bold' : 'text-slate-600'} text-right pr-3 select-none shrink-0 py-0.5 border-r border-slate-800/50 bg-slate-950/40`}>
                  {lineNum}
                </span>
                
                {/* Code Content */}
                <span className={`code-font text-[11px] leading-relaxed whitespace-pre pl-4 pr-4 py-0.5 flex-1 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                  {line || ' '}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CodePanel;
