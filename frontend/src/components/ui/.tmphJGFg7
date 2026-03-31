import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { vi } from 'vitest'
import { Input } from './input'

describe('Input', () => {
  it('renderiza correctamente', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('maneja onChange correctamente', async () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} data-testid="test-input" />)
    
    const input = screen.getByTestId('test-input')
    await userEvent.type(input, 'Hello')
    
    expect(handleChange).toHaveBeenCalledTimes(5)
    expect(input).toHaveValue('Hello')
  })
})
