# Testing Guide

This monorepo uses Vitest as the testing framework with comprehensive test coverage for the Convex backend and React components.

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test:coverage

# Run tests for specific package
pnpm --filter @workspace/backend test
pnpm --filter web test
pnpm --filter widget test
```

## Test Structure

### Backend Tests (`packages/backend/convex/__tests__/`)
- `users.test.ts` - Tests for Convex queries and mutations
- `schema.test.ts` - Schema validation tests

### Web App Tests (`apps/web/`)
- `app/__tests__/page.test.tsx` - Main page component tests
- `components/__tests__/providers.test.tsx` - ConvexProvider tests

### Widget App Tests (`apps/widget/`)
- Similar structure to web app tests

## Testing Stack

- **Vitest**: Fast unit test framework with ESM support
- **@testing-library/react**: React component testing utilities
- **@testing-library/user-event**: Realistic user interaction simulation
- **convex-test**: Mock Convex backend for testing
- **happy-dom**: Lightweight DOM implementation

## Writing Tests

### Testing Convex Functions

```typescript
import { convexTest } from 'convex-test'
import { api } from '../_generated/api'
import schema from '../schema'

const t = convexTest(schema)

// Test queries
const result = await t.query(api.users.getMany, {})

// Test mutations
const id = await t.mutation(api.users.add, {})
```

### Testing React Components

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()
render(<MyComponent />)

// Query elements
const button = screen.getByRole('button')

// Simulate interactions
await user.click(button)

// Assertions
expect(button).toBeInTheDocument()
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Clarity**: Use descriptive test names
3. **Coverage**: Test happy paths, edge cases, and error conditions
4. **Mocking**: Mock external dependencies (Convex hooks, API calls)
5. **Cleanup**: Use beforeEach/afterEach for setup and teardown

## Coverage Goals

Aim for:
- 80%+ line coverage
- 80%+ branch coverage
- 100% coverage of critical paths