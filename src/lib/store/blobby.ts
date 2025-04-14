import { create } from 'zustand';

type BlobbyStatus = 'IDLE' | 'WAVE' | 'CELEBRATE' | 'THINKING' | 'SAD';

interface BlobbyState {
  status: BlobbyStatus;
  duration?: number;
  setStatus: (status: BlobbyStatus, duration?: number) => void;
}

export const useBlobbyStore = create<BlobbyState>((set) => ({
  status: 'IDLE',
  duration: undefined,
  setStatus: (status, duration) => set({ status, duration }),
})); 