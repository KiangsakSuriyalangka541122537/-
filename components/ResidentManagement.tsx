import React, { useState, useMemo } from 'react';
import { Building, Resident, RoomType } from '../types';

interface ResidentManagementProps {
  buildings: Building[];
  onAddResident: (roomId: string, name: string) => void;
  onEditResident: (residentId: string, newName: string) => void;
  onDeleteResident: (residentId: string) => void;
}

// Flat structure for easier table rendering
interface ResidentRow {
  id: string;
  name: string;
  buildingId: string;
  buildingName: string;
  floorId: string;
  floorName: string;
  roomId: string;
  roomNumber: string;
}

export const ResidentManagement: React.FC<ResidentManagementProps> = ({
  buildings,
  onAddResident,
  onEditResident,
  onDeleteResident
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<{ id: string, name: string } | null>(null);

  // Add Mode States
  const [selectedBuildingId, setSelectedBuildingId] = useState('');
  const [selectedFloorId, setSelectedFloorId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [newResidentName, setNewResidentName] = useState('');

  // Flatten Data
  const allResidents = useMemo(() => {
    const rows: ResidentRow[] = [];
    buildings.forEach(b => {
      b.floors.forEach(f => {
        f.rooms.forEach(r => {
          r.residents.forEach(res => {
            rows.push({
              id: res.id,
              name: res.name,
              buildingId: b.id,
              buildingName: b.name,
              floorId: f.id,
              floorName: f.name || `ชั้น ${f.number}`,
              roomId: r.id,
              roomNumber: r.number
            });
          });
        });
      });
    });
    return rows;
  }, [buildings]);

  // Filter Data
  const filteredResidents = useMemo(() => {
    return allResidents.filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allResidents, searchTerm]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingResident(null);
    setSelectedBuildingId('');
    setSelectedFloorId('');
    setSelectedRoomId('');
    setNewResidentName('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (id: string, name: string) => {
    setEditingResident({ id, name });
    setNewResidentName(name);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResident) {
      onEditResident(editingResident.id, newResidentName);
    } else {
      if (selectedRoomId && newResidentName) {
        onAddResident(selectedRoomId, newResidentName);
      }
    }
    setIsModalOpen(false);
  };

  // Helper to get selectable options for Add Modal
  const getFloors = () => {
    const b = buildings.find(b => b.id === selectedBuildingId);
    return b ? b.floors : [];
  };

  const getAvailableRooms = () => {
    const b = buildings.find(b => b.id === selectedBuildingId);
    const f = b?.floors.find(f => f.id === selectedFloorId);
    if (!f) return [];
    
    return f.rooms.filter(r => {
      const capacity = r.type === RoomType.SINGLE ? 1 : 2;
      return r.residents.length < capacity;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-slate-200 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>🗂️</span> รายชื่อผู้พักอาศัยรวม
          </h2>
          <p className="text-slate-500 text-sm mt-1">จัดการข้อมูลผู้พักอาศัยทั้งหมดในระบบ</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
            <div className="relative w-full md:w-64">
                <input 
                    type="text" 
                    placeholder="ค้นหาชื่อ หรือ เลขห้อง..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white text-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <button
            onClick={handleOpenAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap"
            >
            <span className="text-lg font-bold leading-none">+</span> เพิ่มผู้พัก
            </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                <tr>
                <th className="p-4 font-semibold w-16 text-center text-slate-400">#</th>
                <th className="p-4 font-semibold">ชื่อ - นามสกุล</th>
                <th className="p-4 font-semibold">อาคาร</th>
                <th className="p-4 font-semibold">ชั้น</th>
                <th className="p-4 font-semibold">ห้อง</th>
                <th className="p-4 font-semibold text-right">จัดการ</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredResidents.length > 0 ? (
                    filteredResidents.map((row, index) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4 text-center text-slate-400 font-mono text-sm">{index + 1}</td>
                        <td className="p-4">
                        <div className="font-medium text-slate-700 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs">👤</div>
                            {row.name}
                        </div>
                        </td>
                        <td className="p-4 text-slate-600">{row.buildingName}</td>
                        <td className="p-4 text-slate-600">{row.floorName}</td>
                        <td className="p-4">
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-mono font-medium text-sm border border-blue-100">
                                {row.roomNumber}
                            </span>
                        </td>
                        <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                            onClick={() => handleOpenEdit(row.id, row.name)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="แก้ไขชื่อ"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                            </svg>
                            </button>
                            <button
                            onClick={() => {
                                if(window.confirm(`ยืนยันการลบรายชื่อผู้พักอาศัย "${row.name}" ออกจากระบบ?`)) {
                                    onDeleteResident(row.id);
                                }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="ลบ"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                            </svg>
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                            ไม่พบข้อมูลผู้พักอาศัย
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">
                {editingResident ? 'แก้ไขชื่อผู้พักอาศัย' : 'เพิ่มผู้พักอาศัยใหม่'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {!editingResident && (
                  <>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">เลือกอาคาร</label>
                        <select 
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                            value={selectedBuildingId}
                            onChange={e => {
                                setSelectedBuildingId(e.target.value);
                                setSelectedFloorId('');
                                setSelectedRoomId('');
                            }}
                            required
                        >
                            <option value="">-- เลือกอาคาร --</option>
                            {buildings.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">เลือกชั้น</label>
                        <select 
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400 bg-white text-black"
                            value={selectedFloorId}
                            onChange={e => {
                                setSelectedFloorId(e.target.value);
                                setSelectedRoomId('');
                            }}
                            disabled={!selectedBuildingId}
                            required
                        >
                            <option value="">-- เลือกชั้น --</option>
                            {getFloors().map(f => (
                                <option key={f.id} value={f.id}>{f.name || `ชั้น ${f.number}`}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">เลือกห้อง (เฉพาะห้องว่าง)</label>
                        <select 
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400 bg-white text-black"
                            value={selectedRoomId}
                            onChange={e => setSelectedRoomId(e.target.value)}
                            disabled={!selectedFloorId}
                            required
                        >
                            <option value="">-- เลือกห้อง --</option>
                            {getAvailableRooms().map(r => (
                                <option key={r.id} value={r.id}>
                                    ห้อง {r.number} ({r.type === RoomType.SINGLE ? 'Single' : 'Double'})
                                </option>
                            ))}
                        </select>
                        {selectedFloorId && getAvailableRooms().length === 0 && (
                            <p className="text-xs text-red-500 mt-1">ชั้นนี้ไม่มีห้องว่าง</p>
                        )}
                    </div>
                  </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ - นามสกุล</label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-black"
                  placeholder="เช่น สมชาย ใจดี"
                  value={newResidentName}
                  onChange={e => setNewResidentName(e.target.value)}
                />
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  disabled={!editingResident && !selectedRoomId}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};