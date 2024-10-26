
import getCurrentUser from "@/actions/getCurrentUser";
import UserProfile from "./Profile";
// import Image from "next/image";
import { User } from "@/types/user";
import { redirect } from "next/navigation";

const Page = async () => {

    const currentUser = await getCurrentUser();
    if (!currentUser) {
        // redirect to login page
        redirect("/login");

        // return <div className="">
        //     <div className="text-center text-3xl mt-16 font-semibold">Sign in to view profile!</div>
        //     <div className=" saturate-150 contrast-100 px-5 py-3">
        //         <Image alt="sign in image" src="https://i.postimg.cc/hGR0Vw8f/forgot-password-concept-illustration-114360-1123.jpg" width={500} height={500} className="mx-auto mt-4 rounded-md" />
        //     </div>
        // </div>
    }

    return (
        <UserProfile currentUser={currentUser as User} />
    );
}

export default Page;