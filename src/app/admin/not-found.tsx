import AdminSidebar from "@/components/admin-sidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import NotFoundComponent from "@/components/utilities/not-found";
import {cn} from "@/lib/utils";

export default function NotFound() {
  return (<SidebarProvider>
    <AdminSidebar/>

    <SidebarInset
      className={cn('max-h-svh overflow-auto', 'peer-data-[variant=inset]:max-h-[calc(100svh-theme(spacing.4))]', 'peer-data-[variant=floating]:max-h-[calc(100svh-theme(spacing.4))]')}>
      <NotFoundComponent/>
    </SidebarInset>
  </SidebarProvider>)
}