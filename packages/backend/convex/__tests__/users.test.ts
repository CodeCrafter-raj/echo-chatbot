import { describe, it, expect, beforeEach } from 'vitest'
import { convexTest } from 'convex-test'
import { api } from '../_generated/api'
import schema from '../schema'

describe('users.ts - Convex Functions', () => {
  let t: ReturnType<typeof convexTest>

  beforeEach(() => {
    t = convexTest(schema)
  })

  describe('getMany query', () => {
    it('should return an empty array when no users exist', async () => {
      const users = await t.query(api.users.getMany, {})
      expect(users).toEqual([])
      expect(Array.isArray(users)).toBe(true)
    })

    it('should return all users from the database', async () => {
      // Insert test users
      await t.run(async (ctx) => {
        await ctx.db.insert('users', { name: 'Alice' })
        await ctx.db.insert('users', { name: 'Bob' })
        await ctx.db.insert('users', { name: 'Charlie' })
      })

      const users = await t.query(api.users.getMany, {})
      
      expect(users).toHaveLength(3)
      expect(users.map(u => u.name)).toContain('Alice')
      expect(users.map(u => u.name)).toContain('Bob')
      expect(users.map(u => u.name)).toContain('Charlie')
    })

    it('should return users with correct structure', async () => {
      await t.run(async (ctx) => {
        await ctx.db.insert('users', { name: 'TestUser' })
      })

      const users = await t.query(api.users.getMany, {})
      
      expect(users[0]).toHaveProperty('_id')
      expect(users[0]).toHaveProperty('_creationTime')
      expect(users[0]).toHaveProperty('name')
      expect(typeof users[0].name).toBe('string')
    })

    it('should handle large number of users', async () => {
      // Insert many users
      await t.run(async (ctx) => {
        for (let i = 0; i < 100; i++) {
          await ctx.db.insert('users', { name: `User${i}` })
        }
      })

      const users = await t.query(api.users.getMany, {})
      expect(users).toHaveLength(100)
    })
  })

  describe('add mutation', () => {
    it('should insert a user with name "Abhi"', async () => {
      const userId = await t.mutation(api.users.add, {})
      
      expect(userId).toBeDefined()
      expect(typeof userId).toBe('string')
    })

    it('should create a user that can be retrieved via getMany', async () => {
      const userId = await t.mutation(api.users.add, {})
      const users = await t.query(api.users.getMany, {})
      
      expect(users).toHaveLength(1)
      expect(users[0].name).toBe('Abhi')
      expect(users[0]._id).toBe(userId)
    })

    it('should add multiple users when called multiple times', async () => {
      await t.mutation(api.users.add, {})
      await t.mutation(api.users.add, {})
      await t.mutation(api.users.add, {})
      
      const users = await t.query(api.users.getMany, {})
      expect(users).toHaveLength(3)
      expect(users.every(u => u.name === 'Abhi')).toBe(true)
    })

    it('should return a valid document ID', async () => {
      const userId1 = await t.mutation(api.users.add, {})
      const userId2 = await t.mutation(api.users.add, {})
      
      expect(userId1).not.toBe(userId2)
      expect(userId1).toBeTruthy()
      expect(userId2).toBeTruthy()
    })

    it('should persist data across queries', async () => {
      const userId = await t.mutation(api.users.add, {})
      
      const users1 = await t.query(api.users.getMany, {})
      const users2 = await t.query(api.users.getMany, {})
      
      expect(users1).toEqual(users2)
      expect(users1[0]._id).toBe(userId)
    })

    it('should handle rapid successive additions', async () => {
      const userIds = await Promise.all([
        t.mutation(api.users.add, {}),
        t.mutation(api.users.add, {}),
        t.mutation(api.users.add, {}),
      ])
      
      expect(new Set(userIds).size).toBe(3) // All IDs should be unique
      
      const users = await t.query(api.users.getMany, {})
      expect(users).toHaveLength(3)
    })
  })

  describe('integration tests', () => {
    it('should maintain data integrity across mixed operations', async () => {
      // Add some users
      await t.mutation(api.users.add, {})
      await t.mutation(api.users.add, {})
      
      let users = await t.query(api.users.getMany, {})
      expect(users).toHaveLength(2)
      
      // Add more users
      await t.mutation(api.users.add, {})
      
      users = await t.query(api.users.getMany, {})
      expect(users).toHaveLength(3)
      expect(users.every(u => u.name === 'Abhi')).toBe(true)
    })

    it('should handle concurrent read and write operations', async () => {
      // Perform operations concurrently
      await Promise.all([
        t.mutation(api.users.add, {}),
        t.query(api.users.getMany, {}),
        t.mutation(api.users.add, {}),
        t.query(api.users.getMany, {}),
      ])
      
      const users = await t.query(api.users.getMany, {})
      expect(users.length).toBeGreaterThanOrEqual(2)
    })
  })
})