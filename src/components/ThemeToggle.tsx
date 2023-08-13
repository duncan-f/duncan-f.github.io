import { useEffect, useState } from 'react';
import { IoSunny } from 'react-icons/io5';
import { FaMoon } from 'react-icons/fa';

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
      className="mx-2 inline-flex items-center justify-center"
      onClick={toggleTheme}
    >
      {theme === "dark" ? <IoSunny size={20} /> : <FaMoon size={20} />}
    </button>
  ) : (
    <div />
  )
}

export default ThemeToggle;
