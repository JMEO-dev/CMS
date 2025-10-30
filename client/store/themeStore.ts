import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ThemeState {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'light',
            toggleTheme: () => set((state) => ({
                theme: state.theme === 'light' ? 'dark' : 'light',
            })),
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useThemeStore;