export function useTheme() {
  function applyTheme(theme: string) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
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

  return { initTheme, setTheme, currentTheme };
}
