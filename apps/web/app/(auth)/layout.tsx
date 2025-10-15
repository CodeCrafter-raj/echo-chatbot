import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthLayout>
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center"> 
      {children}
    </div>
    </AuthLayout> 
  );
} 

export default Layout;