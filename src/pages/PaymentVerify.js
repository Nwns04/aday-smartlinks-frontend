import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    // Extract the payment reference returned by Paystack in the callback URL.
    const reference = searchParams.get('reference');

    if (reference) {
      toast.success("Payment successful! Upgrading your account...");
      
      // Optionally, you could call a backend endpoint to verify the payment further.
      // In our integration, the webhook already verifies the payment.
      // Here, we simply refresh the user data so that premium status reflects.
      const storedUser = JSON.parse(localStorage.getItem("user"));
      API.get(`/auth/user/${storedUser.email}`)
        .then(res => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(err => {
          console.error("Error refreshing user data:", err);
          toast.error("Failed to refresh user info.");
        });

      // Redirect to dashboard after a short delay.
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } else {
      toast.error("Payment verification failed. Missing reference!");
      navigate('/dashboard');
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <p className="text-xl font-semibold">Verifying your payment...</p>
        <p className="mt-2">Please wait while we update your account.</p>
      </div>
    </div>
  );
};

export default PaymentVerify;
