import {v} from "convex/values";
import {mutation} from "../_generated/server";


const SESSION_DURATION_MS=24*60*60*1000; // 1 DAY

export const create=mutation({
  args:{
    name:v.string(),
    email:v.string(),
    organizationId:v.string(),
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
    })
  ),
  },  handler:async(ctx,args)=>{

    const expiresAt=Date.now()+SESSION_DURATION_MS;

    const contanctSessionsId=await ctx.db.insert("contanctSessions",{
      name:args.name,
      email:args.email,
      organizationId:args.organizationId,
      expiresAt,
      metadata:args.metadata
    });
    return contanctSessionsId;
  }
});

export const validate=mutation({
  args:{
    contanctSessionsId:v.id("contanctSessions"),
  },  handler:async(ctx,args)=>{

    const contanctSession=await ctx.db.get(args.contanctSessionsId);
    if(!contanctSession){
      return {valid:false, reason:"Not found"};
    }

    if(contanctSession.expiresAt<Date.now()){
      return {valid:false, reason:"Contanct Session Expired"};
    }

    return {valid:true,contanctSession};
},
});
