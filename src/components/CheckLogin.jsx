import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const CheckLogin = ({ user, children }) => {
    useEffect(() => {
      if (!user) {
        alert("Please login first");
        console.log("Access Denied :/")
      }
    }, [user]);
  
    if (!user) {
      return <Navigate to="/" replace />;
    }
  
    return children;
  };
  
  export default CheckLogin;