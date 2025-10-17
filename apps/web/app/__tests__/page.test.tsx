import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Page from '../page'

// Mock Convex hooks
const mockUseQuery = vi.fn()
const mockUseMutation = vi.fn()

vi.mock('convex/react', () => ({
  useQuery: () => mockUseQuery(),
  useMutation: () => mockUseMutation(),
}))

// Mock Button component
vi.mock('@workspace/ui/components/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

describe('Page Component (apps/web)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the page title', () => {
      mockUseQuery.mockReturnValue([])
      mockUseMutation.mockReturnValue(vi.fn())

      render(<Page />)
      
      expect(screen.getByText('Hello Web/App')).toBeInTheDocument()
    })

    it('should render the Add User button', () => {
      mockUseQuery.mockReturnValue([])
      mockUseMutation.mockReturnValue(vi.fn())

      render(<Page />)
      
      expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument()
    })

    it('should apply correct CSS classes to container', () => {
      mockUseQuery.mockReturnValue([])
      mockUseMutation.mockReturnValue(vi.fn())

      const { container } = render(<Page />)
      const mainDiv = container.querySelector('.flex.flex-col.items-center.justify-center.min-h-svh')
      
      expect(mainDiv).toBeInTheDocument()
    })
  })

  describe('user data display', () => {
    it('should display empty array when no users exist', () => {
      mockUseQuery.mockReturnValue([])
      mockUseMutation.mockReturnValue(vi.fn())

      render(<Page />)
      
      expect(screen.getByText('[]')).toBeInTheDocument()
    })

    it('should display users as JSON when users exist', () => {
      const mockUsers = [
        { _id: '1', name: 'Abhi', _creationTime: 123456 },
        { _id: '2', name: 'Test User', _creationTime: 123457 },
      ]
      mockUseQuery.mockReturnValue(mockUsers)
      mockUseMutation.mockReturnValue(vi.fn())

      render(<Page />)
      
      const displayedText = screen.getByText((content, element) => {
        return element?.tagName === 'P' && content.includes('"name": "Abhi"')
      })
      
      expect(displayedText).toBeInTheDocument()
    })

    it('should format JSON with proper indentation', () => {
      const mockUsers = [{ _id: '1', name: 'Abhi', _creationTime: 123456 }]
      mockUseQuery.mockReturnValue(mockUsers)
      mockUseMutation.mockReturnValue(vi.fn())

      const { container } = render(<Page />)
      const paragraph = container.querySelector('p')
      
      expect(paragraph?.textContent).toContain('\n')
      expect(paragraph?.textContent).toContain('  ')
    })

    it('should handle null/undefined users gracefully', () => {
      mockUseQuery.mockReturnValue(undefined)
      mockUseMutation.mockReturnValue(vi.fn())

      render(<Page />)
      
      // Should not crash, undefined stringified is "undefined" or might not render
      expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument()
    })

    it('should update display when users change', () => {
      mockUseQuery.mockReturnValue([])
      mockUseMutation.mockReturnValue(vi.fn())

      const { rerender } = render(<Page />)
      expect(screen.getByText('[]')).toBeInTheDocument()

      // Simulate users being added
      mockUseQuery.mockReturnValue([{ _id: '1', name: 'Abhi', _creationTime: 123456 }])
      rerender(<Page />)

      expect(screen.queryByText('[]')).not.toBeInTheDocument()
      expect(screen.getByText(/"name": "Abhi"/)).toBeInTheDocument()
    })
  })

  describe('add user functionality', () => {
    it('should call addUser mutation when button is clicked', async () => {
      const mockAddUser = vi.fn()
      mockUseQuery.mockReturnValue([])
      mockUseMutation.mockReturnValue(mockAddUser)

      const user = userEvent.setup()
      render(<Page />)
      
      const button = screen.getByRole('button', { name: /add user/i })
      await user.click(button)
      
      expect(mockAddUser).toHaveBeenCalledTimes(1)
      expect(mockAddUser).toHaveBeenCalledWith()
    })

    it('should handle multiple rapid clicks', async () => {
      const mockAddUser = vi.fn()
      mockUseQuery.mockReturnValue([])
      mockUseMutation.mockReturnValue(mockAddUser)

      const user = userEvent.setup()
      render(<Page />)
      
      const button = screen.getByRole('button', { name: /add user/i })
      
      await user.click(button)
      await user.click(button)
      await user.click(button)
      
      expect(mockAddUser).toHaveBeenCalledTimes(3)
    })

    it('should work even when mutation is loading', async () => {
      const mockAddUser = vi.fn()
      mockUseQuery.mockReturnValue([])
      mockUseMutation.mockReturnValue(mockAddUser)

      const user = userEvent.setup()
      render(<Page />)
      
      const button = screen.getByRole('button', { name: /add user/i })
      await user.click(button)
      
      // Button should still be clickable
      expect(button).toBeEnabled()
    })
  })

  describe('loading and error states', () => {
    it('should handle loading state from useQuery', () => {
      mockUseQuery.mockReturnValue(undefined) // Convex returns undefined during loading
      mockUseMutation.mockReturnValue(vi.fn())

      render(<Page />)
      
      // Should render without crashing
      expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument()
    })

    it('should render correctly when useQuery returns null', () => {
      mockUseQuery.mockReturnValue(null)
      mockUseMutation.mockReturnValue(vi.fn())

      render(<Page />)
      
      expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument()
    })
  })

  describe('integration scenarios', () => {
    it('should handle complete user flow', async () => {
      const mockAddUser = vi.fn()
      mockUseQuery.mockReturnValue([])
      mockUseMutation.mockReturnValue(mockAddUser)

      const user = userEvent.setup()
      const { rerender } = render(<Page />)
      
      // Initially empty
      expect(screen.getByText('[]')).toBeInTheDocument()
      
      // Click add user
      await user.click(screen.getByRole('button', { name: /add user/i }))
      expect(mockAddUser).toHaveBeenCalled()
      
      // Simulate user being added
      mockUseQuery.mockReturnValue([{ _id: '1', name: 'Abhi', _creationTime: 123456 }])
      rerender(<Page />)
      
      expect(screen.getByText(/"name": "Abhi"/)).toBeInTheDocument()
    })

    it('should display large lists of users', () => {
      const manyUsers = Array.from({ length: 50 }, (_, i) => ({
        _id: String(i),
        name: 'Abhi',
        _creationTime: 123456 + i,
      }))
      
      mockUseQuery.mockReturnValue(manyUsers)
      mockUseMutation.mockReturnValue(vi.fn())

      render(<Page />)
      
      const displayText = screen.getByText((content) => content.includes('"_id": "49"'))
      expect(displayText).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper heading hierarchy', () => {
      mockUseQuery.mockReturnValue([])
      mockUseMutation.mockReturnValue(vi.fn())

      render(<Page />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Hello Web/App')
    })

    it('should have clickable button with text', () => {
      mockUseQuery.mockReturnValue([])
      mockUseMutation.mockReturnValue(vi.fn())

      render(<Page />)
      
      const button = screen.getByRole('button', { name: /add user/i })
      expect(button).toBeVisible()
    })
  })
})