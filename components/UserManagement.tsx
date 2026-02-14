import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  currentUser: User;
}

export const UserManagement: React.FC<UserManagementProps> = ({ 
  users, 
  onAddUser, 
  onEditUser, 
  onDeleteUser,
  currentUser
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'WATER' as UserRole
  });

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      password: '',
      role: 'WATER'
    });
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setFormData({
      name: user.name,
      username: user.username,
      password: user.password || '',
      role: user.role
    });
    setEditingId(user.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onEditUser({
        id: editingId,
        ...formData
      });
    } else {
      onAddUser(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`ยืนยันการลบผู้ใช้งาน "${name}" ออกจากระบบ?`)) {
      onDeleteUser(id);
    }
  };

  const roleLabels: Record<UserRole, string> = {
    'ADMIN': 'ผู้ดูแลระบบ (Admin)',
    'WATER': 'เจ้าหน้าที่จดมิเตอร์น้ำ',
    'ELECTRIC': 'เจ้าหน้าที่จดมิเตอร์ไฟ'
  };

  const roleColors: Record<UserRole, string> = {
    'ADMIN': 'bg-slate-800 text-white',
    'WATER': 'bg-blue-100 text-blue-800',
    'ELECTRIC': 'bg-amber-100 text-amber-800'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>👥</span> จัดการผู้ใช้งาน
          </h2>
          <p className="text-slate-500 text-sm mt-1">เพิ่ม ลบ หรือแก้ไขสิทธิ์การเข้าถึงระบบ</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          เพิ่มผู้ใช้งานใหม่
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold">ชื่อ - นามสกุล</th>
              <th className="p-4 font-semibold">ชื่อผู้ใช้ (Username)</th>
              <th className="p-4 font-semibold">รหัสผ่าน</th>
              <th className="p-4 font-semibold">สิทธิ์การใช้งาน (Role)</th>
              <th className="p-4 font-semibold text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-slate-700">{user.name}</div>
                </td>
                <td className="p-4 text-slate-600 font-mono text-sm">{user.username}</td>
                <td className="p-4 text-slate-400 font-mono text-xs">
                    {/* Hide actual password visually */}
                    {user.password ? '••••••••' : '(No Password)'}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border border-transparent ${roleColors[user.role]}`}>
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(user)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="แก้ไข"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                      </svg>
                    </button>
                    {user.id !== currentUser.id && ( // Prevent deleting self
                        <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="ลบ"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                        </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">
                {editingId ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ - นามสกุล (Display Name)</label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-black"
                  placeholder="เช่น สมชาย ใจดี"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อผู้ใช้ (Username)</label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-black"
                  placeholder="สำหรับเข้าสู่ระบบ"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">รหัสผ่าน (Password)</label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-black"
                  placeholder="กำหนดรหัสผ่าน"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">สิทธิ์การใช้งาน (Role)</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-black"
                >
                  <option value="ADMIN">ผู้ดูแลระบบสูงสุด (Admin)</option>
                  <option value="WATER">เจ้าหน้าที่จดมิเตอร์น้ำ (Water)</option>
                  <option value="ELECTRIC">เจ้าหน้าที่จดมิเตอร์ไฟ (Electric)</option>
                </select>
                <p className="text-xs text-slate-400 mt-1">
                    {formData.role === 'ADMIN' && 'เข้าถึงได้ทุกเมนู และจัดการผู้ใช้งานได้'}
                    {formData.role === 'WATER' && 'เข้าถึงเฉพาะหน้าจดมิเตอร์น้ำ'}
                    {formData.role === 'ELECTRIC' && 'เข้าถึงเฉพาะหน้าจดมิเตอร์ไฟ'}
                </p>
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors"
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