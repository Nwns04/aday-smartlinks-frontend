import React, { useContext, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const decoded = jwtDecode(credentialResponse.credential);
      const userPayload = {
        googleId: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        profileImage: decoded.picture,
      };

      // 🔥 Extract username from subdomain if on a custom domain like blazerq.aday.io
      const hostname = window.location.hostname;
      const mainDomain = 'localhost'; // Change to 'aday.io' in production
      let username = null;
      if (hostname !== mainDomain && hostname.includes('.')) {
        username = hostname.split('.')[0];
        userPayload.username = username;
      }

      const { token, user } = await API.post("/auth/google", userPayload).then(r => r.data);
       localStorage.setItem("token", token);
       localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      toast.success(`Welcome ${decoded.name.split(" ")[0]}! 🎉`);
      
      // Use userPayload since "user" is not defined here.
      if (!userPayload.subscriptionPlan) {
        window.location.href = "/price";
      } else {
        window.location.href = "/dashboard";
      }
      
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Login Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Sign in to Aday Smartlinks</h2>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
        // useOneTap
      />
      {loading && <p className="text-sm mt-2">Signing in...</p>}
    </div>
  );
};

export default Login;
