import { create } from "zustand";


const useDiamondsStore = create((set ) => ({
    diamonds : 0,
    setDiamonds : (diamonds) => set({diamonds})
}));

export default useDiamondsStore;
