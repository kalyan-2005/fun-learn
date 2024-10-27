import React from 'react'
import GeminiTTS from '@/components/Converter';
import getCurrentUser from '@/actions/getCurrentUser';

async function page() {
  const currentUser = await getCurrentUser();
  return (
    <div>
        <GeminiTTS currentUser={currentUser}/>
    </div>
  )
}

export default page