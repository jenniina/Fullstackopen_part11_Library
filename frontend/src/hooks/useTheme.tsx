import React, { useContext, createContext, useEffect } from 'react'
import useMediaQuery from './useMediaQuery'
import useLocalStorage from './useStorage'

const ThemeContext = createContext(true)
const ThemeUpdateContext = createContext<React.EffectCallback | undefined>(undefined)

export function useTheme() {
  return useContext(ThemeContext)
}

export function useThemeUpdate() {
  return useContext(ThemeUpdateContext)
}

export function ThemeProvider({ children }: React.ReactPortal) {
  const prefersLight = useMediaQuery('(prefers-color-scheme: light)')

  const [lightTheme, setLightTheme] = useLocalStorage(
    'useLightMode',
    prefersLight ? true : false
  )

  const lightEnabled = lightTheme ?? prefersLight

  function toggleTheme() {
    setLightTheme((prevTheme) => !prevTheme)
  }

  useEffect(() => {
    /*add 'light' class to body when lightEnabled is true*/
    document.body.classList.toggle('light', lightEnabled)
  }, [lightEnabled])

  return (
    <ThemeContext.Provider value={lightTheme}>
      <ThemeUpdateContext.Provider value={toggleTheme}>
        {children}
      </ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  )
}
