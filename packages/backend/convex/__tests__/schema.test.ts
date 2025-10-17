import { describe, it, expect } from 'vitest'
import { convexTest } from 'convex-test'
import schema from '../schema'
import { v } from 'convex/values'

describe('schema.ts - Schema Definition', () => {
  let t: ReturnType<typeof convexTest>

  beforeEach(() => {
    t = convexTest(schema)
  })

  describe('users table schema', () => {
    it('should have users table defined in schema', () => {
      expect(schema).toBeDefined()
      expect(schema.tables).toHaveProperty('users')
    })

    it('should accept valid user documents', async () => {
      await expect(
        t.run(async (ctx) => {
          return await ctx.db.insert('users', { name: 'Valid User' })
        })
      ).resolves.toBeDefined()
    })

    it('should require name field', async () => {
      await expect(
        t.run(async (ctx) => {
          // @ts-expect-error - Testing runtime validation
          return await ctx.db.insert('users', {})
        })
      ).rejects.toThrow()
    })

    it('should require name to be a string', async () => {
      await expect(
        t.run(async (ctx) => {
          // @ts-expect-error - Testing runtime validation
          return await ctx.db.insert('users', { name: 123 })
        })
      ).rejects.toThrow()
    })

    it('should reject invalid field types', async () => {
      await expect(
        t.run(async (ctx) => {
          // @ts-expect-error - Testing runtime validation
          return await ctx.db.insert('users', { name: null })
        })
      ).rejects.toThrow()
    })

    it('should accept empty string as name', async () => {
      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', { name: '' })
      })
      
      expect(userId).toBeDefined()
    })

    it('should accept long strings as name', async () => {
      const longName = 'A'.repeat(1000)
      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', { name: longName })
      })
      
      expect(userId).toBeDefined()
    })

    it('should accept special characters in name', async () => {
      const specialNames = [
        'User with spaces',
        'User-with-dashes',
        'User_with_underscores',
        'User.with.dots',
        'User@with#symbols',
        '用户', // Chinese characters
        '😀', // Emoji
      ]

      for (const name of specialNames) {
        const userId = await t.run(async (ctx) => {
          return await ctx.db.insert('users', { name })
        })
        expect(userId).toBeDefined()
      }
    })

    it('should not accept additional undefined fields', async () => {
      await expect(
        t.run(async (ctx) => {
          // @ts-expect-error - Testing runtime validation
          return await ctx.db.insert('users', { 
            name: 'Test', 
            extraField: 'should fail' 
          })
        })
      ).rejects.toThrow()
    })
  })

  describe('schema structure validation', () => {
    it('should export a valid schema object', () => {
      expect(schema).toBeDefined()
      expect(schema.tables).toBeDefined()
      expect(typeof schema.tables).toBe('object')
    })

    it('should only have users table defined', () => {
      const tableNames = Object.keys(schema.tables)
      expect(tableNames).toEqual(['users'])
    })
  })
})