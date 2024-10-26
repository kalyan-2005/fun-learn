import { create } from "zustand";

const useSuperCoinsStore = create((set) => ({
  superCoins: 0,
  setSuperCoins: (superCoins) => set({ superCoins }),
}));

export default useSuperCoinsStore;
