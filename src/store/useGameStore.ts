import { create } from 'zustand';
import { User } from 'firebase/auth';

export type GameMode = 'ACTION' | 'SIMULATION' | 'CONSEQUENCE';

interface GameState {
  user: User | null;
  mode: GameMode;
  credits: number;
  defenseLevel: number;
  architecturalStage: number; // -1: Empty, 0: Garage, 1: Hub, 2: Skyscraper
  shiftTime: number; // in seconds
  setUser: (user: User | null) => void;
  setMode: (mode: GameMode) => void;
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => boolean;
  upgradeArchitecture: () => void;
  tick: () => void;
  resetShift: () => void;
  setGameData: (data: Partial<GameState>) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  user: null,
  mode: 'ACTION',
  credits: 100,
  defenseLevel: 1,
  architecturalStage: -1,
  shiftTime: 600, // 10 minutes
  setUser: (user) => set({ user }),
  setMode: (mode) => set({ mode }),
  addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
  spendCredits: (amount) => {
    const { credits } = get();
    if (credits >= amount) {
      set({ credits: credits - amount });
      return true;
    }
    return false;
  },
  upgradeArchitecture: () => {
    const { credits, architecturalStage } = get();
    const upgradeCosts = [50, 150, 300];
    const nextStage = architecturalStage + 1;
    const cost = upgradeCosts[nextStage] || 0;
    
    if (credits >= cost && architecturalStage < 2) {
      set({ 
        credits: credits - cost,
        architecturalStage: nextStage 
      });
      return true;
    }
    return false;
  },
  tick: () => set((state) => {
    if (state.shiftTime <= 0) return { mode: 'SIMULATION' };
    return { shiftTime: state.shiftTime - 1 };
  }),
  resetShift: () => set({ shiftTime: 600 }),
  setGameData: (data) => set((state) => ({ ...state, ...data })),
}));
