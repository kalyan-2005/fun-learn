"use client";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import ThemeSwitch from "./ThemeSwitch";
import { User } from "@/types/user";
import Image from "next/image";
import useHeartsStore from "@/hooks/useHeartsStore";
import useDiamondsStore from "@/hooks/useDiamondsStore";
import useSuperCoinsStore from "@/hooks/useSuperCoinsStore";
import useAvatarStore from "@/hooks/useAvatarStore";
import { useRouter } from "next/navigation";
interface Props {
  currentUser: User;
  menu: boolean;
  setMenu: Dispatch<SetStateAction<boolean>>;
}

const Navbar: React.FC<Props> = ({ currentUser, menu, setMenu }: Props) => {
  const router = useRouter();
  const { hearts,setHearts } = useHeartsStore();
  const { diamonds,setDiamonds } = useDiamondsStore();
  const { superCoins,setSuperCoins} = useSuperCoinsStore()
  const { avatar , setAvatar} = useAvatarStore()



  useEffect(() => {
    setHearts(currentUser?.hearts);
    setDiamonds(currentUser?.diamonds);
    setSuperCoins(currentUser?.supercoins);
    setAvatar(currentUser?.avatar);
  } , []);
  

  return (
    <div className="flex py-5 items-center justify-end px-8">
      <h1>Avatar</h1>
    </div>
  );
};

export default Navbar;
