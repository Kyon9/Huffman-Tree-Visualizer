
import React from 'react';
import { AnimationStep } from '../types';

interface InfoPanelProps {
  step: AnimationStep;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ step }) => {
  return (
    <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex flex-col h-full overflow-hidden">
      {/* Status Section */}
      <div className="flex-shrink-0 mb-4">
        <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">Current Step</h4>
        <div className="bg-blue-600/10 p-3 rounded-lg border-l-2 border-blue-500 shadow-sm">
           <p className="text-blue-100 text-xs leading-relaxed font-medium">
             {step.description}
           </p>
        </div>
      </div>

      {/* Codes Section - Scrollable */}
      <div className="flex-grow flex flex-col min-h-0">
        <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">Resulting Codes</h4>
        <div className="flex-grow overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-1.5 pb-2">
             {step.huffmanCodes && Object.entries(step.huffmanCodes).length > 0 ? (
               Object.entries(step.huffmanCodes).sort().map(([char, code]) => (
                 <div key={char} className="flex items-center justify-between px-3 py-1.5 bg-slate-950/40 rounded border border-slate-800/40 transition-all hover:bg-slate-900/60">
                    <span className="text-blue-400 font-bold text-xs">{char}</span>
                    <span className="text-slate-300 font-mono text-xs tracking-widest bg-slate-800/50 px-2 py-0.5 rounded leading-none">{code}</span>
                 </div>
               ))
             ) : (
               <div className="h-24 flex flex-col items-center justify-center text-slate-700 text-center bg-slate-950/20 rounded-lg border border-dashed border-slate-800">
                 <p className="text-[10px] font-medium uppercase tracking-tight italic">Merging in progress...</p>
               </div>
             )}
          </div>
        </div>
      </div>
      
      {/* Legend - Fixed Bottom */}
      <div className="pt-3 border-t border-slate-800/60 flex-shrink-0 mt-2">
         <div className="flex flex-col gap-2">
             <div className="flex items-center space-x-2">
                 <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                 <span className="text-[9px] text-slate-500 font-bold uppercase">Merge Focus</span>
             </div>
             <div className="flex items-center space-x-2">
                 <span className="w-2 h-2 rounded-full bg-green-500"></span>
                 <span className="text-[9px] text-slate-500 font-bold uppercase">Coding Path</span>
             </div>
         </div>
      </div>
    </div>
  );
};

export default InfoPanel;
