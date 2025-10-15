import {query, mutation} from "./_generated/server";


export const getMany= query({
  args:{},
  handler: async (ctx) =>{

    const users=await ctx.db.query("users").collect();

    return users;
  },
});


export const add=mutation({
  args:{},
  handler: async (ctx) =>{
    const identity=await ctx.auth.getUserIdentity();

    if(identity===null){  
      throw new Error("Must be signed in to add a user");
    }

    const orgId=identity.orgId as string;

    if(!orgId){ 
      throw new Error("Must be in an organization to add a user");
    }

    const userId = await ctx.db.insert("users",{
      name:"Abhi"
    });
    return userId
  },
});