"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Script from "next/script";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import { buySuperCoins } from "@/actions/superCoins";
import useHeartsStore from "@/hooks/useHeartsStore";
import useDiamondsStore from "@/hooks/useDiamondsStore";
import useSuperCoinsStore from "@/hooks/useSuperCoinsStore";

const heartz = [1, 2, 3, 4, 5];

const Premium = () => {
  const secret = 22071;
  const [tokens, setTokens] = useState(5);
  let totalAmt = tokens * 5;
  let amtWithDis = totalAmt - (tokens - 1) * 2;
  const name = "kalyan";
  const email = "kalyantingani@gmail.com";
  const currency = "INR";
  const { hearts, setHearts } = useHeartsStore();
  const { diamonds, setDiamonds } = useDiamondsStore();
  const { superCoins, setSuperCoins } = useSuperCoinsStore();

  const createOrderId = async (amount: number) => {
    try {
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };
  const processPayment = async (
    e: React.FormEvent<HTMLFormElement>,
    tokens: number,
    amount: number
  ) => {
    e.preventDefault();
    try {
      const orderId: string = await createOrderId(amount);
      const options = {
        key: process.env.key_id,
        amount: amount * 100,
        currency: currency,
        name: "name",
        description: "description",
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            tokens,
            amount,
          };

          const result = await fetch("/api/verify", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
          const res = await result.json();
          if (res.isOk) alert("payment succeed");
          else {
            alert(res.message);
          }
        },
        prefill: {
          name: name,
          email: email,
        },
        theme: {
          color: "#FEEBC8",
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        alert(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.log(error);
    }
  };
  const handleBasic = (e: any) => {
    processPayment(e, tokens, tokens * 5 - (tokens - 1) * 2);
  };
  const handleBulk = (e: any) => {
    processPayment(e, 20, 50);
  };
  const handlePremium = (e: any) => {
    processPayment(e, secret, 200);
  };

  const handleTokenChange = (e: any) => {
    const value = parseInt(e.target.value);
    if (value < 1) {
      setTokens(1);
    } else if (value >= 10000) {
      setTokens(10000);
    } else {
      setTokens(value);
    }
  };
  const handleHearts = async (count: any) => {
    toast.loading("Adding coins...");
    try {
      const res = await fetch("/api/hearts/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          count,
        }),
      });
      setHearts(hearts + count);
      setDiamonds(diamonds - (5 * count - (count - 1) * 2));
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss();
      toast(`${count} hearts added successfully`, {
        icon: "❤️",
      });
    }
  };

  const handleCoins = async (count: any) => {
    toast.loading("Adding coins...");
    try {
      const res = await fetch("/api/superCoins/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          count,
        }),
      });
      setDiamonds(diamonds - (20 * count - (count - 1) * 2));
      setSuperCoins(superCoins + count);
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss();
      toast(`${count} coins added successfully`, {
        icon: "🪙",
      });
    }
  };
  return (
    <>
      <div className="flex justify-center items-center w-full gap-20 mt-20">
        <div className=" p-1 rounded-[50px] w-[35%]">
          <div className="p-1 rounded-[50px]">
            <div className="flex flex-col gap-3 relative bg-primary-900 border-b-4 border-l-8 border-primary-700 rounded-[50px] p-5">
              {heartz.map((heart: number, index: number) => {
                return (
                  <div
                    key={index}
                    className="bg-white rounded-[40px] border-b-4 border-l-8 border-secondary-400  p-1"
                  >
                    <div
                      onClick={() => handleHearts(index + 1)}
                      className="flex px-6 h-[60px] justify-between items-center bg-primary-600 hover:bg-primary-500 cursor-pointer text-black rounded-[40px]"
                    >
                      <div className="flex items-center gap-5">
                        <Image
                          src="/heart.png"
                          width={25}
                          height={25}
                          alt="diamond"
                        />
                        <h1 className="font-black">x {index + 1}</h1>
                      </div>
                      <div className="flex items-center gap-1 text-lg font-semibold">
                        {5 * (index + 1) - index * 2}
                        <Image
                          src="/diamond.png"
                          width={20}
                          height={20}
                          alt="diamond"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="bg-primary-900 border-b-2 border-l-4 border-primary-700 rounded-xl text-xl font-bold absolute -top-9 left-36 p-2 px-4">
                Buy Hearts
              </div>
            </div>
          </div>
        </div>
        <div className=" p-1 rounded-[50px] w-[35%]">
          <div className="p-1 rounded-[50px]">
            <div className="flex flex-col gap-3 bg-primary-900 relative border-b-4 border-l-8 border-primary-700 rounded-[50px] p-5">
              {heartz.map((heart: number, index: number) => {
                return (
                  <div
                    key={index}
                    className="bg-white rounded-[40px] border-b-4 border-l-8 border-secondary-400  p-1"
                  >
                    <div
                      onClick={() => handleCoins(index + 1)}
                      className="flex px-6 h-[60px] justify-between items-center bg-primary-600 hover:bg-primary-500 cursor-pointer text-black rounded-[40px]"
                    >
                      <div className="flex items-center gap-5">
                        <Image
                          src="/Supercoin.png"
                          width={25}
                          height={25}
                          alt="diamond"
                        />
                        <h1 className="font-black">x {index + 1}</h1>
                      </div>
                      <div className="flex items-center gap-1 text-lg font-semibold">
                        {20 * (index + 1) - index * 2}
                        <Image
                          src="/diamond.png"
                          width={20}
                          height={20}
                          alt="diamond"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="bg-primary-900 border-b-2 border-l-4 border-primary-700 rounded-xl text-xl font-bold absolute -top-9 left-36 p-2 px-4">
                Buy Coins
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Premium;
