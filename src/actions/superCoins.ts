import { db } from "@/lib/db";
import getCurrentUser from "./getCurrentUser";

export  const  updateSuperCoins = async (id: string) => {
  
  
  const user = await db.user.update({
    where: {
      id,
    },
    data: {
      supercoins: {
        decrement: 1,
      },
    },
  });

  return user;
};

export const buySuperCoins = async (count: number) => {
  const currentUser = await getCurrentUser();
  if(!currentUser) return null;
  const user = await db.user.update({
    where: {
      id:currentUser.id,
    },
    data: {
      supercoins: {
        increment: count,
      },
    },
  });
  const diamons = await db.user.update({
    where: {
      id:currentUser.id,
    },
    data: {
      diamonds: {
        decrement: count*20-2*(count-1),
      },
    },
  });
  return user;
}