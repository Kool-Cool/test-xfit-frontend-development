import AdminSidebarFooter from '@/components/admin-sidebar/sidebar-footer'
import {NavLink} from '@/components/ui/navlink'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import {Home, Users2} from 'lucide-react'

const items = [
  {
    title: 'Gym Dashboard',
    url: '/admin/gym',
    icon: Home,
  },
  {
    title: 'User Dashboard',
    url: '/admin/users',
    icon: Users2,
  },
  // {
  //   title: 'Calendar',
  //   url: '#',
  //   icon: Calendar,
  // },
  // {
  //   title: 'Search',
  //   url: '#',
  //   icon: Search,
  // },
  // {
  //   title: 'Settings',
  //   url: '#',
  //   icon: Settings,
  // },
]

const AdminSidebar = () => {
  return (
    <Sidebar collapsible={'icon'} variant={'floating'} className={''}>

        {/* <p className='text-xl px-4 font-semibold group-data-[state=collapsed]:sr-only group-data-[state=expanded]:not-sr-only'>
          X-Fit
        </p> */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={'sr-only'}>
            Admin Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    className={
                      'group/navlink flex  items-center data-[active=false]:text-gray-400 data-[active=true]:text-gray-700'
                    }
                    href={item.url}>
                    <item.icon className={'text-lg'} />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <AdminSidebarFooter />
      <SidebarRail className={'group-data-[side=left]:-right-[0.5rem] group-data-[side=left]:top-[0.8rem] group-data-[side=left]:bottom-[0.8rem]'}/>
    </Sidebar>
  )
}

export default AdminSidebar
