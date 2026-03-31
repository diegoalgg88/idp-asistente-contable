import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renderiza correctamente', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('maneja diferentes variantes', () => {
    const { container: defaultBtn } = render(<Button>Default</Button>)
    const { container: destructiveBtn } = render(<Button variant="destructive">Destructive</Button>)
    
    expect(defaultBtn.firstChild).toHaveClass('bg-primary')
    expect(destructiveBtn.firstChild).toHaveClass('bg-destructive/10')
  })

  it('se deshabilita correctamente', async () => {
    const handleClick = vi.fn()
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    )
    
    const button = screen.getByRole('button')
    await userEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
    expect(button).toBeDisabled()
  })
})
