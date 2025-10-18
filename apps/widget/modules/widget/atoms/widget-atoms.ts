import {atom} from "jotai"
import { WidgetScreen } from "../types";
import { Contact } from "lucide-react";
import{atomFamily, atomWithStorage} from "jotai/utils";
import { CONTANCT_SESSION_KEY } from "../constants";
import { Id } from "@workspace/backend/_generated/dataModel";
//Basic widget state atoms

export const screenAtom=atom<WidgetScreen>("loading");
export const organizationIdAtom=atom<string|null>(null);

//organization-scoped contanct session atom
export const contactSessionIdAtomFamily=atomFamily((organizationId:string)=>
  {
    return atomWithStorage<Id<"contanctSessions"> | null>(`${CONTANCT_SESSION_KEY}_${organizationId}`, null)
  
  })

const contactSessionId=atomWithStorage("some_key", null);
//Error
export const errorMessageAtom=atom<string |null>(null);
export const loadingMessageAtom=atom<string | null>(null);