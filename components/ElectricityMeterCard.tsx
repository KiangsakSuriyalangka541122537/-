import React, { useState, useEffect } from 'react';
import { Room } from '../types';

interface ElectricityMeterCardProps {
  room: Room;
  currentMonth: string;
  onUpdate: (roomId: string, units: number) => void;
  unitPrice: number;
}

export const ElectricityMeterCard: React.FC<ElectricityMeterCardProps> = ({ room, currentMonth, onUpdate, unitPrice }) => {
  const bill = room.bills[currentMonth] || { electricity: 0, electricityUnits: 0 };
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempUnits, setTempUnits] = useState<string>(bill.electricityUnits !== undefined ? bill.electricityUnits.toString() : '');

  // Sync with external updates
  useEffect(() => {
    const b = room.bills[currentMonth];
    setTempUnits(b?.electricityUnits !== undefined ? b.electricityUnits.toString() : '');
    setIsEditing(false); 
  }, [currentMonth, room.bills]);

  const handleSave = () => {
      const val = parseFloat(tempUnits);
      if (!isNaN(val)) {
          onUpdate(room.id, val);
          setIsEditing(false);
      }
  };

  const handleCancel = () => {
      setTempUnits(bill.electricityUnits !== undefined ? bill.electricityUnits.toString() : '');
      setIsEditing(false);
  };

  const handleEdit = () => {
      setIsEditing(true);
      setTempUnits(bill.electricityUnits !== undefined ? bill.electricityUnits.toString() : '');
  };

  const calculatePrice = () => {
      const val = parseFloat(tempUnits);
      return isNaN(val) ? 0 : Math.round(val * unitPrice);
  };

  const adjustValue = (amount: number) => {
      const current = parseFloat(tempUnits) || 0;
      setTempUnits(Math.max(0, current + amount).toString());
  };

  return (
    <div className={`
        group bg-white rounded-lg p-4 border shadow-sm transition-all duration-200 flex flex-col gap-3 relative overflow-hidden
        ${isEditing ? 'border-amber-400 ring-2 ring-amber-100 shadow-md transform scale-[1.02] z-10' : 'border-slate-200 hover:shadow-md'}
    `}>
        {/* Header */}
        <div className="flex justify-between items-start">
            <div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">ห้อง</div>
                <div className={`text-xl font-bold ${isEditing ? 'text-amber-700' : 'text-slate-800'}`}>{room.number}</div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isEditing ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.285 6.426a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
                </svg>
            </div>
        </div>

        {/* Input/Display Section */}
        <div className="relative min-h-[48px] flex items-end justify-end">
            {isEditing ? (
                <div className="w-full relative group/input">
                    <input 
                        type="number" 
                        autoFocus
                        min="0"
                        className="w-full text-3xl font-mono font-medium text-amber-700 text-right bg-transparent border-b-2 border-amber-300 focus:border-amber-500 outline-none pb-1 pr-8 placeholder-amber-200 transition-colors" 
                        placeholder="0"
                        value={tempUnits} 
                        onChange={e => setTempUnits(e.target.value)}
                        onKeyDown={e => {
                            if(e.key === 'Enter') handleSave();
                            if(e.key === 'Escape') handleCancel();
                        }}
                    />
                    {/* Custom Spinner */}
                    <div className="absolute right-0 top-0 bottom-1 w-6 flex flex-col justify-center gap-0.5 opacity-0 group-hover/input:opacity-100 transition-opacity">
                        <button 
                            onClick={() => adjustValue(1)}
                            className="flex-1 flex items-end justify-center text-slate-300 hover:text-amber-500 transition-colors"
                            tabIndex={-1}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                            </svg>
                        </button>
                        <button 
                            onClick={() => adjustValue(-1)}
                            className="flex-1 flex items-start justify-center text-slate-300 hover:text-amber-500 transition-colors"
                            tabIndex={-1}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                    </div>
                     <span className="absolute left-0 bottom-2 text-xs text-amber-500 pointer-events-none animate-fade-in">ระบุหน่วย</span>
                </div>
            ) : (
                <div className="flex flex-col items-end">
                    <div className="text-3xl font-mono font-bold text-slate-700">{bill.electricityUnits || 0}</div>
                    <div className="text-xs text-slate-400">หน่วย</div>
                </div>
            )}
        </div>

        {/* Footer & Actions */}
        <div className="flex justify-between items-center mt-1 pt-2 border-t border-slate-50 min-h-[40px]">
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-400">รวมเป็นเงิน</span>
                <div className="flex items-baseline gap-1">
                     <span className={`text-lg font-bold ${isEditing ? 'text-slate-400' : 'text-amber-600'}`}>
                        {(isEditing ? calculatePrice() : (bill.electricity || 0)).toLocaleString()}
                     </span>
                     <span className="text-[10px] text-slate-400">฿</span>
                </div>
            </div>

            <div className="flex gap-2">
                {isEditing ? (
                    <>
                        <button 
                            onClick={handleCancel}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                            title="ยกเลิก"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={!tempUnits}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded shadow-sm text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                            <span>บันทึก</span>
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={handleEdit}
                        className="bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 px-3 py-1.5 rounded border border-slate-200 hover:border-amber-200 text-sm font-medium transition-all flex items-center gap-1 group/btn"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400 group-hover/btn:text-amber-500">
                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                        </svg>
                        แก้ไข
                    </button>
                )}
            </div>
        </div>
    </div>
  );
};