import { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false)

  const [theme, setTheme] = useState(() => {
    if (import.meta.env.SSR) {
      return undefined
    }
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme')
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  const toggleTheme = () => {
    const t = theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', t)
    setTheme(t)
  }

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
    }
  }, [theme])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted ? (
    <button
      type="button"
      aria-label="Toggle theme"
      className='uppercase'
      onClick={toggleTheme}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  ) : (
    <div />
  )
}

export default ThemeToggle;
