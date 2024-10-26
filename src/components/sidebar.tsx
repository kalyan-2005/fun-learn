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
      <div className="font-bold px-4 py-4 text-2xl text-slate-300">
        <Link href="/" className="hover:text-blue-800 transition-colors">
          Fun Learn
        </Link>
      </div>
      <div className="h-full flex flex-col justify-between">
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