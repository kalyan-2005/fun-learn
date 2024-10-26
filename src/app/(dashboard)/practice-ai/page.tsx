import React from 'react'
import AiQuiz from './ai-quiz'
import getCurrentUser from '@/actions/getCurrentUser'


async function page() {
  const currentUser = await getCurrentUser()
  
  return (
    <div>
      <AiQuiz currentUser={currentUser} />
    </div>
  )
}

export default page