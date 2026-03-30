import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Limpia el DOM después de cada test
afterEach(() => {
  cleanup()
})

// Configurar React.act para evitar warnings de ReactDOMTestUtils.act
// Testing Library usa internamente ReactDOMTestUtils.act que está deprecated
globalThis.IS_REACT_ACT_ENVIRONMENT = true

// Suppress ReactDOMTestUtils.act and Radix UI ref warnings
const originalWarn = console.warn.bind(console)
const originalError = console.error.bind(console)

console.warn = (message, ...args) => {
  if (typeof message === 'string') {
    // Filtrar warnings sobre ReactDOMTestUtils.act
    if (message.includes('ReactDOMTestUtils.act')) {
      return
    }
    // Filtrar warnings de Radix UI sobre refs
    if (message.includes('Function components cannot be given refs')) {
      return
    }
  }
  originalWarn(message, ...args)
}

console.error = (message, ...args) => {
  if (typeof message === 'string') {
    // Filtrar errors sobre ReactDOMTestUtils.act
    if (message.includes('ReactDOMTestUtils.act')) {
      return
    }
    // Filtrar errors de Radix UI sobre refs
    if (message.includes('Function components cannot be given refs')) {
      return
    }
  }
  originalError(message, ...args)
}
