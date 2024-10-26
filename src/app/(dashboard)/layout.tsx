import "@/styles/globals.css";
import type { Metadata } from "next";
import HomeLayout from "@/components/layouts/home-layout";
import getCurrentUser from "@/actions/getCurrentUser";
import { User } from "@/types/user";

export const metadata: Metadata = {
  title: "Fun Learn",
  description: "Tutly",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  return <HomeLayout currentUser={currentUser as User}>{children}</HomeLayout>;
}

// import { SidebarProvider } from "../../components/ui/sidebar";
// import { SidebarComponent } from "../../components/Sidebar";
// import { DynamicBreadcrumbs } from "../../components/DynamicBreadcrums";
// import { Separator } from "../../components/ui/separator";
// import { SidebarTrigger, SidebarInset } from "../../components/ui/sidebar";
// import { Toaster } from "react-hot-toast"
// import { sidebarData} from "./rolesData";

// export const metadata = {
//   title: "FunLab",
//   description: "FunLab",
// };

// export default function RootLayout({
//   children,
// }) {
//   const roleData = sidebarData;

//   return (
//     <html lang="en">
//       <body>
//         <Toaster />
//         <SidebarProvider>
//           <SidebarComponent data={roleData} />
//           <SidebarInset>
//             <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
//               <div className="flex items-center gap-2 px-4">
//                 <SidebarTrigger className="-ml-1" />
//                 <Separator orientation="vertical" className="mr-2 h-4" />
//                 <DynamicBreadcrumbs />
//               </div>
//             </header>
//             <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
//               {children}
//             </div>
//           </SidebarInset>
//         </SidebarProvider>
//       </body>
//     </html>
//   );
// }