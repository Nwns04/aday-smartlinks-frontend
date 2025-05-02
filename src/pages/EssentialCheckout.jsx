// src/pages/EssentialCheckout.jsx
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ESSENTIAL_FEATURES = [
  "Unlimited Smart Links",
  "Email Capture & Export",
  "Basic Analytics Dashboard",
  "Unlimited Campaigns",
];

export default function EssentialCheckout() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // guard: only show if they really clicked Essential
    if (sessionStorage.getItem('pendingPlan') !== 'essential') {
      navigate('/price', { replace: true });
    }
  }, [navigate]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const { data: { user: updated } } = await API.post(
        '/api/subscribe/essential',
        { email: user.email }
      );
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      toast.success('🎉 Your 14-day trial has started! Check your email for details.');
      sessionStorage.removeItem('pendingPlan');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to activate trial.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow mt-16">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Essential Plan — 14-Day Free Trial
      </h1>
      <ul className="list-disc list-inside mb-6 text-gray-800 dark:text-gray-200">
        {ESSENTIAL_FEATURES.map(f => <li key={f}>{f}</li>)}
      </ul>
      <button
        onClick={handleConfirm}
        disabled={loading}
        className={`w-full py-2 rounded text-white ${
          loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Activating…' : 'Confirm & Start Trial'}
      </button>
      <button
        onClick={() => navigate('/price')}
        disabled={loading}
        className="w-full mt-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
      >
        Cancel
      </button>
    </div>
  );
}
