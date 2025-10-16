import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  contanctSessions:defineTable({
    name: v.string(),
    email: v.string(),
    organizationId: v.string(),
    expiresAt: v.number(),
    metadata:v.optional(v.object({
      userAgent:v.optional(v.string()),
      language:v.string(),
      languages:v.optional(v.string()),
      platform:v.string(),
      vendor:v.string(),
      screenResolution:v.string(),
      timezone:v.string(),
      timeszoneOffset:v.number(),
      cookieEnabled:v.boolean(),
    }))
  })

  .index("by_organizationId",["organizationId"],)
  .index("by_expires_at",["expiresAt"]),

  users: defineTable({
    name: v.string(),
  })
});