import MenuItem from "./MenuItem";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NEXT_PUBLIC_SIGN_IN_URL } from "@/utils/constants";
import useClickOutside from "@/hooks/useClickOutside";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { User } from "@/types/user";

const UserProfile = ({ currentUser }: { currentUser: User }) => {
  const router = useRouter();

  const [isOpen, setIsOpen, componentRef] =
    useClickOutside<HTMLDivElement>(false);

  return (
    <div className="">
      <div className="flex gap-1 sm:gap-3 items-center hover:bg-blue-500 hover:text-white rounded mb-2">
        <div
          ref={componentRef}
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-3 flex items-center gap-4 cursor-pointer"
        >
          <div>
            <Image
              className="rounded-full"
              src={currentUser?.image || "/images/placeholder.jpg"}
              width={40}
              height={40}
              alt="profile img"
            />
          </div>
          <h1 className="max-w-[120px] overflow-hidden text-ellipsis">{currentUser?.username}</h1>
          {isOpen && (
            <div className="absolute rounded-lg text-white bg-blue-500 shadow-md min-w-max overflow-hidden -right-28 bottom-0 text-sm flex flex-col cursor-pointer">
              <div className="  ">
                <MenuItem
                  onClick={() => {
                    router.push("/profile");
                  }}
                  label="Profile"
                />
                <hr />
                <MenuItem
                  onClick={() => {
                    signOut({ callbackUrl: NEXT_PUBLIC_SIGN_IN_URL });
                    localStorage.clear();
                  }}
                  label="SignOut"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
