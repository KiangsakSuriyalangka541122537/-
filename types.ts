export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
}

export interface Resident {
  id: string;
  name: string;
}

export interface BillData {
  water: number;
  electricity: number;
  waterUnits?: number;
  electricityUnits?: number; // New field for electricity meter units
}

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  residents: Resident[];
  bills: Record<string, BillData>; // Key is "YYYY-MM" e.g. "2023-10"
}

export interface Floor {
  id: string;
  number: number;
  name?: string; // Optional custom name for the floor
  rooms: Room[];
}

export interface Building {
  id: string;
  name: string;
  floors: Floor[];
}

export interface DragItem {
  residentId: string;
  sourceRoomId: string;
  sourceBuildingId: string;
}

export type UserRole = 'ADMIN' | 'WATER' | 'ELECTRIC';

export interface User {
  id: string;
  username: string;
  password?: string; // Optional for session user, required for management
  role: UserRole;
  name: string;
}