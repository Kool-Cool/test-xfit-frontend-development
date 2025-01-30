import AdminSidebar from '@/components/admin-sidebar'
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar'
import {cn} from '@/lib/utils'
import type {ReactNode} from 'react'

const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <AdminSidebar />

        <SidebarInset className={cn('max-h-svh overflow-auto','peer-data-[variant=inset]:max-h-[calc(100svh-theme(spacing.4))]','peer-data-[variant=floating]:max-h-[calc(100svh-theme(spacing.4))]')}>
            {children}
        </SidebarInset>
    </SidebarProvider>
  )
}
export default AdminLayout
