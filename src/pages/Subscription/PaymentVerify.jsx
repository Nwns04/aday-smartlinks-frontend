import React, { useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import toast from "react-hot-toast";

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      toast.error("Payment verification failed. Missing reference!");
      return navigate("/dashboard");
    }

    toast.success("Payment successful! Updating your account...");

    const storedUser = JSON.parse(localStorage.getItem("user"));
    API.get(`/auth/user/${storedUser.email}`)
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch((err) => {
        console.error("Error refreshing user data:", err);
        toast.error("Failed to refresh user info.");
      });

    setTimeout(() => {
      navigate("/dashboard");
    }, 3000);
  }, [searchParams, navigate, setUser]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <p className="text-xl font-semibold">Verifying your payment...</p>
        <p className="mt-2 text-gray-600">Please wait while we update your account.</p>
      </div>
    </div>
  );
};

export default PaymentVerify;
