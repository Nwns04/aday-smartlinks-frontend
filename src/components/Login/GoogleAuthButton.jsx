import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from 'jwt-decode';
import API from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const GoogleAuthButton = ({ setUser, setLoading, onSuccess }) => {
  const navigate = useNavigate();
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

      const hostname = window.location.hostname;
      const mainDomain = "localhost"; // Replace with "aday.io" in prod

      if (hostname !== mainDomain && hostname.includes(".")) {
        userPayload.username = hostname.split(".")[0];
      }

      const { token, user } = await API.post("/auth/google", userPayload).then((r) => r.data);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast.success(`Welcome ${decoded.name.split(" ")[0]}! 🎉`);

      // Call the onSuccess callback to close the modal
      if (onSuccess) onSuccess();

      const pendingPlan = sessionStorage.getItem("pendingPlan");
     
      if (pendingPlan === "essential") {
        navigate("/price?login=true", { replace: true });
      } else if (pendingPlan === "premium") {
        navigate("/price?login=true", { replace: true });
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Login Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google Login Failed")}
        shape="pill"
        size="large"
        text="continue_with"
        width="300"
      />
    </div>
  );
};

export default GoogleAuthButton;