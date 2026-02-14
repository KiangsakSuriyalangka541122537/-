import React from 'react';
import { Resident } from '../types';

interface ResidentItemProps {
  resident: Resident;
  roomId: string;
  buildingId: string;
  onRemove: (id: string) => void;
  onMove: (resident: Resident) => void;
}

export const ResidentItem: React.FC<ResidentItemProps> = ({ 
  resident, 
  roomId, 
  buildingId, 
  onRemove,
  onMove
}) => {
  return (
    <div
      onClick={() => onMove(resident)}
      className="
        group relative flex items-center justify-between 
        bg-white border border-slate-200 shadow-sm hover:shadow-md
        hover:border-blue-300 hover:bg-blue-50
        rounded px-3 py-2 
        cursor-pointer active:scale-[0.99]
        transition-all duration-200 select-none
      "
      title="คลิกเพื่อย้ายห้อง"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-xs text-slate-500 group-hover:bg-blue-200 group-hover:text-blue-700 transition-colors">
            👤
        </div>
        <span className="truncate text-base font-medium text-slate-700 group-hover:text-blue-800 transition-colors">{resident.name}</span>
      </div>
      
      <div className="flex items-center">
        {/* Move Icon (Visible on hover) */}
        <div className="mr-1 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M2.24 6.8a.75.75 0 001.06-.04l1.95-2.1v8.59a.75.75 0 001.5 0V4.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0L2.2 5.74a.75.75 0 00.04 1.06zm8 6.4a.75.75 0 00-.04 1.06l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75a.75.75 0 00-1.5 0v8.59l-1.95-2.1a.75.75 0 00-1.06-.04z" clipRule="evenodd" />
            </svg>
        </div>

        <button 
            onClick={(e) => { e.stopPropagation(); onRemove(resident.id); }}
            className="
            w-6 h-6 flex items-center justify-center rounded-full 
            text-slate-300 hover:text-red-500 hover:bg-red-50 
            opacity-0 group-hover:opacity-100 transition-all
            "
            title="นำออก"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
        </button>
      </div>
    </div>
  );
};