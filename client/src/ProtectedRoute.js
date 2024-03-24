import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useUserAuth } from './context/UserAuthContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const {auth} = useUserAuth();
  console.log(auth?.roles)
  console.log("ProtectedRoute")


  return (
    allowedRoles?.find( (role)=> role==auth?.roles)
        ? <Outlet /> : auth?.user
        ? <Navigate to="/unauthorized"  />
        : <Navigate to="/"   />
);

}
