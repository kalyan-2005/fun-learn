import { create } from "zustand";



const useHeartsStore = create((set ) => ({
    hearts : 0,
    setHearts : (hearts) => set({hearts})
}));

export default useHeartsStore;
