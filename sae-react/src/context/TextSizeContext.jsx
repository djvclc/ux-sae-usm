import { createContext, useContext, useState } from 'react'

const LS_KEY = 'sae_texto_grande'

const TextSizeContext = createContext({
  textoGrande: false,
  setTextoGrande: () => {},
})

export function TextSizeProvider({ children }) {
  const [textoGrande, setTextoGrandeState] = useState(() => {
    try { return localStorage.getItem(LS_KEY) === 'true' } catch { return false }
  })

  const setTextoGrande = (val) => {
    setTextoGrandeState(val)
    try { localStorage.setItem(LS_KEY, val ? 'true' : 'false') } catch { /* noop */ }
  }

  return (
    <TextSizeContext.Provider value={{ textoGrande, setTextoGrande }}>
      {children}
    </TextSizeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook compartido junto al provider por diseño
export function useTextSize() {
  return useContext(TextSizeContext)
}
