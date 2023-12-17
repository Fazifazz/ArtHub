import React from 'react'
import MyButton from '../../components/MyButton'
import { useNavigate } from 'react-router-dom'
import { ServerVariables } from '../../util/ServerVariables'

function SuccessPage() {
    const navigate = useNavigate()
  return (
    <div className='bg-black text-center'>
      <h2 className='text-green-500'>Payment successful</h2>
      <MyButton text='back to home' onclick={()=>navigate(ServerVariables.ArtistHome)}/>
    </div>
  )
}

export default SuccessPage
