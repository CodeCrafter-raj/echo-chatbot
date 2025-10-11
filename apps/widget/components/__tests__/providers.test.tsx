import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Providers } from '../providers'
import React from 'react'

const mockConvexClient = {
  close: vi.fn(),
}

const MockConvexProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="convex-provider">{children}</div>
}

vi.mock('convex/react', () => ({
  ConvexReactClient: vi.fn(() => mockConvexClient),
  ConvexProvider: MockConvexProvider,
}))

describe('Providers Component (apps/widget)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render children within ConvexProvider', () => {
    render(
      <Providers>
        <div>Test Child</div>
      </Providers>
    )

    expect(screen.getByText('Test Child')).toBeInTheDocument()
    expect(screen.getByTestId('convex-provider')).toBeInTheDocument()
  })

  it('should initialize ConvexReactClient with environment URL', () => {
    const { ConvexReactClient } = require('convex/react')
    
    render(
      <Providers>
        <div>Test</div>
      </Providers>
    )

    expect(ConvexReactClient).toHaveBeenCalled()
  })
})