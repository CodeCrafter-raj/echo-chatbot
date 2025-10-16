import React from 'react'
import { DashboardLayout } from '@/modules/dashboard/ui/layouts/dashboard';

const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <>
     <DashboardLayout>
      {children}
     </DashboardLayout>
    </>
  );
};

export default Layout;
