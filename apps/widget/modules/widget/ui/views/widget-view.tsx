'use client'
import { useAtomValue } from "jotai";
// import { WidgetFooter } from "@/modules/widget/ui/components/widget-footer";
import { WidgetAuthScreen } from "../screens/widget-auth-screen";
import { WidgetErrorScreen } from "../screens/widget-error-screen";
import { screenAtom } from "../../atoms/widget-atoms";
import { use } from "react";
import { WidgetLoadingScreen } from "../screens/widget-loading-screen";

interface Props{
  organizationId: string | null;
};


export const WidgetView = ({ organizationId }: Props) => {
  const screen=useAtomValue(screenAtom);

  const screenComponents={
    loading:<WidgetLoadingScreen organizationId={organizationId}/>,
    error:<WidgetErrorScreen/> ,
    auth:<WidgetAuthScreen/>,
    voice:<p>TODO:Voice</p>,
    selection:<p>TODO:Selection</p>,
    inbox:<p>TODO:Inbox</p>,
    chat:<p>TODO:Chat</p>,
    contanct:<p>TODO:Contanct</p>,
  }
  return (
        <main className=" min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
          {screenComponents[screen]}
        </main>
  );
};