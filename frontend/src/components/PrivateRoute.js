import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";

const PrivateRoute = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);

  useEffect(() => {
    const jwtToken = cookies.jwt;
    if (jwtToken) {
      console.log(jwtToken);
      const picture = "./user.jpg"; // Hoặc bất kỳ giá trị nào mà bạn muốn thiết lập
      localStorage.setItem("picture", picture);
    }
  }, [cookies]);

  const isAuthenticated = () => {
    const jwtToken = cookies.jwt;
    return !!jwtToken;
  };

  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
