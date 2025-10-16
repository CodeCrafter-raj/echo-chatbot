import Vapi from "@vapi-ai/web";
import { useEffect, useState } from "react";

interface TranscriptMessage {
  role:"user" | "assistant";
  text:string;
}

export const useVapi=()=>{
  const [vapi,setVapi]=useState<Vapi | null>(null);
  // const [transcriptions,setTranscriptions]=useState<Transcription[]>([]);
  const [isConnected, setIsConnected]=useState(false);
  const [isConnecting, setIsConnecting]=useState(false);
  const [isSpeaking, setIsSpeaking]=useState(false);
  const [transcript, setTranscript]=useState<TranscriptMessage[]>([]);

  useEffect(()=>{

    //Only for testing the vapi API, otherwise customers will provide their own keys
    const vapiInstance=new Vapi("");
    setVapi(vapiInstance);

    vapiInstance.on("call-start",()=>{
      setIsConnected(true);
      setIsConnecting(false);
      setTranscript([]);
    });

    vapiInstance.on("call-end",()=>{
      setIsConnected(false);
      setIsConnecting(false);
      setIsSpeaking(false);
    });

    vapiInstance.on("speech-start",()=>{
      setIsSpeaking(true);
    });

    vapiInstance.on("speech-end",()=>{
      setIsSpeaking(false);
    }); 

    vapiInstance.on("error",(error:Error)=>{
      console.error("Vapi error:",error);
      setIsConnected(false);
      setIsConnecting(false);
      setIsSpeaking(false);
    });

    vapiInstance.on("message",(message)=>{
      if(message.type==="transcript" && message.transcriptType==="final" ){
        setTranscript((prev)=>[
          ...prev,
          {
            role:message.role==="user" ? "user" : "assistant",
            text:message.transcript
          }
        ]);
      }
    });

    return ()=>{
      vapiInstance.stop();
    }

  },[]);

  const startCall=async()=>{
    if(vapi && !isConnected && !isConnecting){
      setIsConnecting(true);
      try{
        await vapi.start('');
      }catch(error){
        console.error("Failed to start Vapi call:",error);
        setIsConnecting(false);
      }
    }
  };

  const endCall=async()=>{
    if(vapi && isConnected){
      await vapi.stop();
    }
  };

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startCall,
    endCall
  };  
};