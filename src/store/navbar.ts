import { create } from "zustand";

interface NavbarState {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const useNavbarStore = create<NavbarState>()((set) => ({
  isMenuOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
}));

export default useNavbarStore;
