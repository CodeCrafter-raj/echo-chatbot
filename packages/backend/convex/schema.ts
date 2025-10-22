import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  conversations: defineTable({
    threadId: v.string(),
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
    status: v.union(
      v.literal("unresolved"),
      v.literal("escalated"),
      v.literal("resolved")
    ),
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_contact_session_id", ["contactSessionId"])
    .index("by_thread_id", ["threadId"])
    .index("by_status_and_organization_id", ["status", "organizationId"]),

  contactSessions: defineTable({
    name: v.string(),
    email: v.string(),
    organizationId: v.string(),
    expiresAt: v.number(),
    metadata: v.optional(
      v.object({
        userAgent: v.optional(v.string()),
        language: v.string(),
        languages: v.optional(v.string()),
        platform: v.string(),
        vendor: v.string(),
        screenResolution: v.string(),
        timezone: v.string(),
        timeszoneOffset: v.number(),
        cookieEnabled: v.boolean(),
      })
    ),
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_expires_at", ["expiresAt"]),

  users: defineTable({
    name: v.string(),
  }),
});













// import { Organization, } from "@clerk/backend";
// import { defineSchema, defineTable } from "convex/server";
// import { v } from "convex/values";
// import { threadId } from "worker_threads";

// export default defineSchema({
//   conversations:defineTable({
//     threadId: v.string(),
//     OrganizationId: v.string(),
//     contanctSessionId: v.id("contanctSessions"),
//     status: v.union(
//       v.literal("unresolved"),
//       v.literal("escalated"),
//       v.literal("resolved")
//     ),
//   }).index("by_organization_id",["OrganizationId"])
//     .index("by_contanct_session_id",["contanctSessionId"])
//     .index("by_thread_id",["threadId"])
//     .index("by_status_and_organization_id",["status","OrganizationId"])
//     ,
    

//   contanctSessions:defineTable({
//     name: v.string(),
//     email: v.string(),
//     organizationId: v.string(),
//     expiresAt: v.number(),
//     metadata:v.optional(v.object({
//       userAgent:v.optional(v.string()),
//       language:v.string(),
//       languages:v.optional(v.string()),
//       platform:v.string(),
//       vendor:v.string(),
//       screenResolution:v.string(),
//       timezone:v.string(),
//       timeszoneOffset:v.number(),
//       cookieEnabled:v.boolean(),
//     }))
//   })

//   .index("by_organizationId",["organizationId"],)
//   .index("by_expires_at",["expiresAt"]),

//   users: defineTable({
//     name: v.string(),
//   })
// });