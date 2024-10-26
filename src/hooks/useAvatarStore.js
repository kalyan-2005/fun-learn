import { create } from "zustand";


const useAvatarStore = create((set ) => ({
    avatar : null,
    setAvatar : (avatar) => set({avatar})
}));

export default useAvatarStore;
