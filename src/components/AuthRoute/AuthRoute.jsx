import React, { Children, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router";

export default function AuthRoute({ children }) {
  const { token } = useContext(AuthContext);

  if (token) {
   return <Navigate to={"/"} />
  } else {
    return children;
  }
}
