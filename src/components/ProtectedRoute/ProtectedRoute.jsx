import React, { Children, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate    } from "react-router";

export default function ProtectedRoute({children}) {

  const { token } = useContext(AuthContext);

  if (token) {
    return  children  ;
  } 
  else {
    return  <Navigate to={'/login'} />
  }
}
