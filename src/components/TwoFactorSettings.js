import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";

const TwoFactorSettings = () => {
  const { user, setUser } = useContext(AuthContext);
  const [qrCode, setQrCode] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupDone, setSetupDone] = useState(false);

  const setup2FA = async () => {
    setLoading(true);
    try {
      const res = await API.post("/auth/2fa/setup", { email: user.email });
      setQrCode(res.data.otpauthUrl);
      toast.success("Scan the QR code with your authenticator app");
    } catch (error) {
      toast.error("Failed to setup 2FA");
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async () => {
    setLoading(true);
    try {
      const res = await API.post("/auth/2fa/verify", { email: user.email, token });
      setSetupDone(true);
  
      const updated = { ...user, twoFactorEnabled: true };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated)); // ✅ persist update
  
      toast.success(res.data.message);
    } catch (error) {
      toast.error("2FA verification failed");
    } finally {
      setLoading(false);
    }
  };
  

  const disable2FA = async () => {
    setLoading(true);
    try {
      const res = await API.post("/auth/2fa/disable", { email: user.email });
      const updated = { ...user, twoFactorEnabled: false };
      setUser(updated);
      setQrCode("");
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Failed to disable 2FA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Two-Factor Authentication (2FA)</h2>
      {user.twoFactorEnabled ? (
        <>
          <p className="mb-4">2FA is currently enabled.</p>
          <button
            onClick={disable2FA}
            className="bg-red-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Disable 2FA
          </button>
        </>
      ) : (
        <>
          {qrCode ? (
            <>
              <p className="mb-2">Scan this QR code using your authenticator app:</p>
              <div className="mb-4">
                <QRCode value={qrCode} size={128} />
              </div>
              <input
                type="text"
                placeholder="Enter the token"
                className="border p-2 mb-4 rounded w-full"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <button
                onClick={verify2FA}
                className="bg-green-600 text-white px-4 py-2 rounded"
                disabled={loading || !token}
              >
                Verify & Enable 2FA
              </button>
            </>
          ) : (
            <button
              onClick={setup2FA}
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              Setup 2FA
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default TwoFactorSettings;
