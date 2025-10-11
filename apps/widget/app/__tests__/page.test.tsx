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

describe('Page Component (apps/widget)', () => {
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
  })

  describe('user data display', () => {
    it('should display empty array when no users exist', () => {
      mockUseQuery.mockReturnValue([])
      mockUseMutation.mockReturnValue(vi.fn())

      render(<Page />)
      
      expect(screen.getByText('[]')).toBeInTheDocument()
    })

    it('should display users as JSON', () => {
      const mockUsers = [
        { _id: '1', name: 'Abhi', _creationTime: 123456 },
      ]
      mockUseQuery.mockReturnValue(mockUsers)
      mockUseMutation.mockReturnValue(vi.fn())

      render(<Page />)
      
      const displayedText = screen.getByText((content, element) => {
        return element?.tagName === 'P' && content.includes('"name": "Abhi"')
      })
      
      expect(displayedText).toBeInTheDocument()
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
    })
  })
})