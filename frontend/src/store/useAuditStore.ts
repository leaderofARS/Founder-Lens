import { create } from 'zustand';

export const useAuditStore = create((set) => ({
  auditData: { projectName: '', elevatorPitch: '', assumptions: ['', '', ''], monthlyBurn: 0, targetCAC: 0 },
  updateAuditData: (newData: any) => set((state: any) => ({ auditData: { ...state.auditData, ...newData } })),
}));