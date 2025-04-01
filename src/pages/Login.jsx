import React, { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { setUser } = useContext(AuthContext);

  const handleSuccess = (credentialResponse) => {
    setUser(credentialResponse);
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Sign in to Aday Smartlinks</h2>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
};

export default Login;
