import getCurrentUser from "@/actions/getCurrentUser";
import Gemini from "@/components/Doubts"

async function page() {
  const currentUser = await getCurrentUser();
  return (
    <div>
        <Gemini currentUser={currentUser}/>
    </div>
  )
}

export default page