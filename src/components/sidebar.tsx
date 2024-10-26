"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import UserProfile from "./navbar/UserProfile";

interface Props {
  items: {
    name: string;
    icon: any;
    path: string;
  }[];
  menu: boolean;
  setMenu: (menu: boolean) => void;
  currentUser: any;
}

export default function Sidebar({ items, menu, setMenu, currentUser }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const Mobile = (link: string) => {
    router.push(link);
    setMenu(false);
  };
  const Desktop = (link: string) => {
    router.push(link);
  };
  return (
    <div
      className={`bg-background sticky top-0 h-dvh px-2 shadow-sm shadow-blue-800/40`}
    >
      <div className="font-bold px-4 py-4 text-2xl absolute">
        <Link href="/">Fun Learn</Link>
      </div>
      <div className="h-full flex flex-col justify-between pt-16">
        <div className="">
          {items.map((item) => {
            return (
              <div key={item.path}>
                <div
                  onClick={() => Mobile(item.path)}
                  key={item.path}
                  className={`${
                    pathname === item.path ||
                    (pathname !== "/" && pathname?.startsWith(item.path))
                      ? "bg-blue-700 text-white"
                      : "hover:bg-secondary-500 hover:text-white"
                  } m-auto rounded md:hidden px-4 py-3 my-2 flex items-center gap-4 cursor-pointer`}
                >
                  <div className={`text-2xl px-1`}>{item.icon}</div>
                  <h1 className={`${!menu && "hidden"}`}>{item.name}</h1>
                </div>
                <div
                  onClick={() => Desktop(item.path)}
                  key={item.path}
                  className={`${
                    (pathname.startsWith(item.path) && item.path !== "/") ||
                    pathname === item.path ||
                    (pathname === "/" && item.path === "/")
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-500 hover:text-white"
                  } m-auto rounded hidden md:flex px-3 py-3 my-2 items-center gap-4 cursor-pointer`}
                >
                  <div className={`text-2xl`}>{item.icon}</div>
                  <h1 className={`pe-8`}>{item.name}</h1>
                </div>
              </div>
            );
          })}
        </div>
        <div className="">
          <UserProfile currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}

// "use client";

// import * as React from "react";
// import Link from "next/link";
// import {
//   AudioWaveform,
//   BadgeCheck,
//   Bell,
//   BookOpen,
//   Bot,
//   Calendar,
//   ChevronRight,
//   ChevronsUpDown,
//   CreditCard,
//   Folder,
//   Forward,
//   Frame,
//   GraduationCap,
//   LogOut,
//   Map,
//   MoreHorizontal,
//   PenTool,
//   PieChart,
//   Settings2,
//   Sparkles,
//   SquareTerminal,
//   Trash2,
//   UserCheck,
//   Users,
// } from "lucide-react";

// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "../components/ui/collapsible";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../components/ui/dropdown-menu";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuAction,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
//   SidebarRail,
// } from "../components/ui/sidebar";
// import { usePathname, useRouter } from "next/navigation";

// const iconMap = {
//   AudioWaveform,
//   BadgeCheck,
//   Bell,
//   BookOpen,
//   Bot,
//   Calendar,
//   CreditCard,
//   Folder,
//   Forward,
//   Frame,
//   GraduationCap,
//   LogOut,
//   Map,
//   PenTool,
//   PieChart,
//   Settings2,
//   Sparkles,
//   SquareTerminal,
//   Trash2,
//   UserCheck,
//   Users,
// };

// export function SidebarComponent({ data }) {
//   const OrganizationIcon = iconMap[data.organization.logo];
//   const router = useRouter();
//   const pathname = usePathname();

//   return (
//     <Sidebar collapsible="icon">
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton
//               size="lg"
//               className=""
//               onClick={() => {
//                 router.push("/dashboard");
//               }}
//             >
//               <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
//                 {OrganizationIcon && <OrganizationIcon />}
//               </div>
//               <div className="grid flex-1 text-left text-sm leading-tight">
//                 <span className="truncate font-semibold">
//                   {data.organization.name}
//                 </span>
//                 <span className="truncate text-xs">
//                   {data.organization.plan}
//                 </span>
//               </div>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Explore</SidebarGroupLabel>
//           <SidebarMenu>
//             {data.navMain.map((item) => {
//               const ItemIcon = iconMap[item.icon];
//               return (
//                 <Collapsible
//                   key={item.title}
//                   asChild
//                   defaultOpen={item.isActive || pathname.startsWith(item.url)}
//                   className="group/collapsible"
//                 >
//                   <SidebarMenuItem>
//                     {item.items ? (
//                       <CollapsibleTrigger asChild>
//                         <SidebarMenuButton
//                           tooltip={item.title}
//                           className={`${
//                             pathname === item.url
//                               ? "bg-sidebar-accent bg-opacity-20"
//                               : ""
//                           }`}
//                         >
//                           {ItemIcon && <ItemIcon />}
//                           <span>{item.title}</span>
//                           <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//                         </SidebarMenuButton>
//                       </CollapsibleTrigger>
//                     ) : (
//                       <Link href={item.url} passHref legacyBehavior>
//                         <SidebarMenuButton
//                           tooltip={item.title}
//                           className={`${
//                             pathname === item.url
//                               ? "bg-sidebar-accent bg-opacity-20"
//                               : ""
//                           }`}
//                         >
//                           {ItemIcon && <ItemIcon />}
//                           <span>{item.title}</span>
//                         </SidebarMenuButton>
//                       </Link>
//                     )}
//                     {item.items && (
//                       <CollapsibleContent>
//                         <SidebarMenuSub>
//                           {item.items.map((subItem) => {
//                             return (
//                               <SidebarMenuSubItem key={subItem.title}>
//                                 <SidebarMenuSubButton
//                                   asChild
//                                   className={`${
//                                     pathname === subItem.url
//                                       ? "bg-sidebar-accent bg-opacity-20"
//                                       : ""
//                                   }`}
//                                 >
//                                   <Link href={subItem.url}>
//                                     <span>{subItem.title}</span>
//                                   </Link>
//                                 </SidebarMenuSubButton>
//                               </SidebarMenuSubItem>
//                             );
//                           })}
//                         </SidebarMenuSub>
//                       </CollapsibleContent>
//                     )}
//                   </SidebarMenuItem>
//                 </Collapsible>
//               );
//             })}
//           </SidebarMenu>
//         </SidebarGroup>
//         <SidebarGroup className="group-data-[collapsible=icon]:hidden">
//           <SidebarGroupLabel>Subjects</SidebarGroupLabel>
//           <SidebarMenu>
//             {data.subjects.map((item) => {
//               const SubjectIcon = iconMap[item.icon];
//               return (
//                 <SidebarMenuItem key={item.name}>
//                   <Link href={item.url} passHref legacyBehavior>
//                     <SidebarMenuButton>
//                       {SubjectIcon && <SubjectIcon />}
//                       <span>{item.name}</span>
//                     </SidebarMenuButton>
//                   </Link>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <SidebarMenuAction showOnHover>
//                         <MoreHorizontal />
//                         <span className="sr-only">More</span>
//                       </SidebarMenuAction>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent
//                       className="w-48 rounded-lg"
//                       side="bottom"
//                       align="end"
//                     >
//                       <DropdownMenuItem>
//                         <Folder className="text-muted-foreground" />
//                         <span>View Subject</span>
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Forward className="text-muted-foreground" />
//                         <span>Share Subject</span>
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem>
//                         <Trash2 className="text-muted-foreground" />
//                         <span>Remove Subject</span>
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </SidebarMenuItem>
//               );
//             })}
//           </SidebarMenu>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarFooter>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <SidebarMenuButton
//                   size="lg"
//                   className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//                 >
//                   <Avatar className="h-8 w-8 rounded-lg">
//                     <AvatarImage src={data.user.avatar} alt={data.user.name} />
//                     <AvatarFallback className="rounded-lg">JD</AvatarFallback>
//                   </Avatar>
//                   <div className="grid flex-1 text-left text-sm leading-tight">
//                     <span className="truncate font-semibold">
//                       {data.user.name}
//                     </span>
//                     <span className="truncate text-xs">{data.user.email}</span>
//                   </div>
//                   <ChevronsUpDown className="ml-auto size-4" />
//                 </SidebarMenuButton>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent
//                 className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
//                 side="bottom"
//                 align="end"
//                 sideOffset={4}
//               >
//                 <DropdownMenuLabel className="p-0 font-normal">
//                   <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                     <Avatar className="h-8 w-8 rounded-lg">
//                       <AvatarImage
//                         src={data.user.avatar}
//                         alt={data.user.name}
//                       />
//                       <AvatarFallback className="rounded-lg">
//                         {data.user.name
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="grid flex-1 text-left text-sm leading-tight">
//                       <span className="truncate font-semibold">
//                         {data.user.name}
//                       </span>
//                       <span className="truncate text-xs">
//                         {data.user.email}
//                       </span>
//                     </div>
//                   </div>
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuGroup>
//                   <DropdownMenuItem>
//                     <Sparkles />
//                     Upgrade Plan
//                   </DropdownMenuItem>
//                 </DropdownMenuGroup>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuGroup>
//                   <DropdownMenuItem>
//                     <BadgeCheck />
//                     Profile
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Bell />
//                     Notifications
//                   </DropdownMenuItem>
//                 </DropdownMenuGroup>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>
//                   <LogOut />
//                   Log out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   );
// }
