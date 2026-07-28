import { ref } from 'vue';

const isDark = ref(false);
let mediaQueryListener: ((e: MediaQueryListEvent) => void) | null = null;

export function useTheme() {
  function applyTheme(theme: string) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Clean up old listener if any
    if (mediaQueryListener) {
      mediaQuery.removeEventListener('change', mediaQueryListener);
      mediaQueryListener = null;
    }

    const prefersDark = mediaQuery.matches;
    const checkDark = theme === 'dark' || (theme === 'system' && prefersDark);
    isDark.value = checkDark;
    document.documentElement.classList.toggle('dark', checkDark);

    // If system theme, listen to changes
    if (theme === 'system') {
      mediaQueryListener = (e: MediaQueryListEvent) => {
        const currentThemeSetting = localStorage.getItem('theme') || 'system';
        if (currentThemeSetting === 'system') {
          isDark.value = e.matches;
          document.documentElement.classList.toggle('dark', e.matches);
        }
      };
      mediaQuery.addEventListener('change', mediaQueryListener);
    }
  }

  function initTheme() {
    applyTheme(localStorage.getItem('theme') || 'system');
  }

  function setTheme(theme: string) {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  }

  function currentTheme(): string {
    return localStorage.getItem('theme') || 'system';
  }

  return { initTheme, setTheme, currentTheme, isDark };
}
