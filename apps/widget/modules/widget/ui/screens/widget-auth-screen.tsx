import { WidgetHeader } from "../components/widget-header";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  organizationIdAtom,
} from "../../atoms/widget-atoms";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Not a valid email"),
});

export const WidgetAuthScreen = () => {
  const organizationId = useAtomValue(organizationIdAtom);
  const setContactSessionId = useSetAtom(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "" },
  });

  const createContactSession = useMutation(api.public.contactSession.create);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!organizationId) return;

    const metadata: Doc<"contactSessions">["metadata"] = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages?.join(","),
      platform: navigator.platform,
      vendor: navigator.vendor,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timeszoneOffset: new Date().getTimezoneOffset(),
      cookieEnabled: navigator.cookieEnabled,
    };

    const contactSessionId = await createContactSession({
      ...values,
      organizationId,
      metadata,
    });

    setContactSessionId(contactSessionId);
  };

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there!</p>
          <p className="text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>

      <Form {...form}>
        <form
          className="flex flex-1 flex-col gap-y-4 px-4 py-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* --- Name Field --- */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input
                    className="h-10 bg-background"
                    placeholder="e.g. Raj"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- Email Field --- */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Email</FormLabel>
                <FormControl>
                  <Input
                    className="h-10 bg-background"
                    placeholder="e.g. raj@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="mt-4 size-lg"
          >
            Continue
          </Button>
        </form>
      </Form>
    </>
  );
};















// import { WidgetHeader } from "../components/widget-header";
// import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@workspace/ui/components/form";
// import { Input } from "@workspace/ui/components/input";
// import { Button } from "@workspace/ui/components/button";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// const formSchema=z.object({
//   name:z.string().min(1,"Name is required"),
//   email:z.string().min(1,"Email is required").email("Not a valid email"),
// })

// export const WidgetAuthScreen = () => {
//   const form=useForm<z.infer<typeof formSchema>>({
//     resolver:zodResolver(formSchema),
//     defaultValues:{
//       name:"",
//       email:""
//     }
//   });

//   const onSubmit= async (values:z.infer<typeof formSchema>)=>{
//     console.log(values);
//   };

//   return (
//     <>
//       <WidgetHeader>
//         <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
//             <p className="text-3xl">Hi there!</p>
//             <p className="text-lg">Let&apos;s get you started</p>
//           </div>
//       </WidgetHeader> 
//       <Form {...form}>
//         <form className="flex flex-1 flex-col gap-y-4 px-4 py-6"
//         onSubmit={form.handleSubmit(onSubmit)}>

//           <FormField 
//             control={form.control}
//             name="name"
//             render={({field})=>(
//               <FormItem>
//                   <FormControl>
//                     <Input className="h-10 bg-background" placeholder="e.g. Raj"
//                     type="text" {...field}/>

            
//                   </FormControl>
//               </FormItem>
//             )}/>
//           </form>
//       </Form>
//     </>
//   )
// }
