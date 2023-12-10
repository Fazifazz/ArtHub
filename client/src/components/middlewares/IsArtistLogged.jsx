import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { ServerVariables } from '../../util/ServerVariables'

function IsArtistLogged() {
    const {token} = useSelector((state)=>state.ArtistAuth)
  return (
    token?<Outlet /> : <Navigate to={ServerVariables.ArtistLogin} />
  )
}

export default IsArtistLogged
