"use client"

import { useAtomValue, useSetAtom } from "jotai";
import { LoaderIcon } from "lucide-react";
import { contactSessionIdAtomFamily, errorMessageAtom, loadingMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { use, useEffect, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
// import { Session } from "inspector/promises";


type InitStep="org" | "session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({organizationId}:{organizationId:string|null}) => {

  const [step, setStep]=useState<InitStep>("org");
  const [sessionValid, setSessionValid]=useState(false);

  
  const loadingMessage=useAtomValue(loadingMessageAtom);
  const setOrganizationId=useSetAtom(organizationIdAtom);
  const setLoadingMessage=useSetAtom(loadingMessageAtom);
  const SetErrorMessage = useSetAtom(errorMessageAtom);
  const setScreen=useSetAtom(screenAtom);
  const contanctSessionId=useAtomValue(contactSessionIdAtomFamily(organizationId||""))


  const validateOrganization=useAction(api.public.organization.validate)
  useEffect(()=>{
    if(step !=="org"){
      return
    }

    setLoadingMessage("Finding organization ID...")

    if(!organizationId){
      SetErrorMessage("organization ID is required");
      setScreen("error")
      return
    }

    setLoadingMessage("Verfying organization...")

    validateOrganization({organizationId})
    .then((result)=>{
      if(result.valid){
        setOrganizationId(organizationId)
        setStep("session")
      }else{
        SetErrorMessage(result.reason || "Invalid Configuration")
        setScreen("error")
      }
    })
    .catch(()=>{
      SetErrorMessage("Umable to verify organization")
      setScreen("error")
    })
  },[step, organizationId, SetErrorMessage, setScreen, setOrganizationId,setStep,validateOrganization,setLoadingMessage])

  //vaidate session
  const validateContanctSession=useMutation(api.public.contanctSession.validate);
  useEffect(()=>{
    if(step !="session"){
      return;
    }

    setLoadingMessage("Finding contanct session ID...")

    if(!contanctSessionId){
        setSessionValid(false);
        setStep("done")
        return
    }

     setLoadingMessage("Validating Session...")

     validateContanctSession({
      contanctSessionsId:contanctSessionId
     })

     .then((result)=>{
      setSessionValid(result.valid)
      setStep("done")
     }).catch(()=>{
      setSessionValid(false)
      setStep("done")
     })
  },[step,contanctSessionId,validateContanctSession,setLoadingMessage])

  useEffect(()=>{
    if(step !="done")
    {
      return
    }
    const hasValidSession=contanctSessionId && sessionValid
    setScreen(hasValidSession? "selection":"auth")

  },[step, contanctSessionId, sessionValid, setScreen]);


  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there!</p>
          <p className="text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <LoaderIcon className="animate-spin"/>
        <p className="text-sm">
          {loadingMessage || "Loading!!!"}
        </p>


      </div>
    </>

  )
}