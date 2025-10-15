'use client'

import { useMutation, useQuery } from "convex/react"
import {api} from "@workspace/backend/_generated/api"

import { json } from "stream/consumers";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const users=useQuery(api.users.getMany);
  const addUser=useMutation(api.users.add)
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <h1 className="text-2xl font-bold">Hello Widget</h1>
      <Button onClick={()=>addUser()}>Add User</Button>
      <div className="max-w-sm w-full mx-auto  ">
        <p>{JSON.stringify(users, null, 2)}</p>
      </div>
    </div>
  )
}
